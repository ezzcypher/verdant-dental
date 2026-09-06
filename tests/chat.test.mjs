import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

import { startMockAnthropic, text, textThenTool, httpError } from "./helpers/mock-anthropic.mjs";
import { startApp, chat } from "./helpers/server.mjs";

/**
 * These run against a real `next start` and the real database, so route config,
 * middleware, Prisma and the tool executor are all genuinely exercised.
 *
 * The Claude path is driven through a mock Anthropic server (the SDK honours
 * ANTHROPIC_BASE_URL), which means the real request-building, tool loop and
 * database writes are all tested without a live key or a paid call.
 *
 * Requires a production build first:  npm run build
 */

const prisma = new PrismaClient();

const CLAUDE_PORT = 3391;
const RULES_PORT = 3392;

let mock;
let claudeApp; // ANTHROPIC_API_KEY set, pointed at the mock
let rulesApp; // no key at all -> deterministic fallback engine

before(async () => {
  mock = await startMockAnthropic({ script: [text("mock default")] });

  const noKeyEnv = { ...process.env };
  delete noKeyEnv.ANTHROPIC_API_KEY;
  delete noKeyEnv.ANTHROPIC_BASE_URL;

  [claudeApp, rulesApp] = await Promise.all([
    startApp({
      port: CLAUDE_PORT,
      env: { ANTHROPIC_API_KEY: "sk-ant-mock-key-for-tests", ANTHROPIC_BASE_URL: mock.url },
    }),
    startApp({ port: RULES_PORT, env: { ...noKeyEnv, ANTHROPIC_API_KEY: "" } }),
  ]);

  // Warm both apps before asserting on anything. The first request pays for
  // Prisma's cold connect to Neon, and letting the first real test absorb that
  // made it flaky - it intermittently timed out into the fallback engine and
  // failed on a reply that was correct, just produced by the wrong engine.
  await Promise.all([chat(claudeApp.base, "warmup"), chat(rulesApp.base, "warmup")]);
  mock.reset();
});

after(async () => {
  await prisma.appointment.deleteMany({ where: { name: { startsWith: "TEST " } } });
  await prisma.chatSession.deleteMany({ where: { patientName: { startsWith: "TEST " } } });
  await prisma.$disconnect();
  await Promise.all([claudeApp?.stop(), rulesApp?.stop(), mock?.close()]);
});

/* ------------------------------------------------------------------ *
 * Claude path (mocked transport, real everything else)
 * ------------------------------------------------------------------ */

describe("Claude path", () => {
  test("answers through the Anthropic SDK and returns the model's reply", async () => {
    mock.setScript([text("We are open Monday to Thursday 8 to 7.")]);
    const r = await chat(claudeApp.base, "what are your opening hours?");

    assert.equal(r.status, 200);
    assert.equal(r.reply, "We are open Monday to Thursday 8 to 7.");
    assert.ok(mock.requests.length >= 1, "the app must have called the Anthropic API");
  });

  test("sends the database-backed catalogue in a cached system block", async () => {
    mock.reset();
    mock.setScript([text("ok")]);
    await chat(claudeApp.base, "how much are veneers?");

    const sent = mock.requests.at(-1).body;
    const stable = sent.system[0];

    // Prices must come from the database, not from the prompt author.
    const veneer = await prisma.treatment.findFirst({ where: { name: { contains: "Veneer" } } });
    assert.ok(veneer?.priceFrom, "seed data must include a veneer price");
    assert.ok(
      stable.text.includes(veneer.priceFrom),
      `system prompt must carry the DB price ${veneer.priceFrom}`,
    );
    assert.deepEqual(stable.cache_control, { type: "ephemeral" }, "catalogue must be cached");
    assert.equal(sent.system[1].cache_control, undefined, "volatile state must sit after the breakpoint");
    assert.ok(/never invent|do not have that/i.test(stable.text), "must forbid inventing facts");
  });

  test("advertises exactly the two permitted tools", async () => {
    mock.reset();
    mock.setScript([text("ok")]);
    await chat(claudeApp.base, "hello");

    const names = mock.requests.at(-1).body.tools.map((t) => t.name).sort();
    assert.deepEqual(names, ["book_appointment", "save_patient_details"]);
  });

  test("executes book_appointment and writes a real row to the database", async () => {
    mock.reset();
    mock.setScript([
      textThenTool("Let me get that booked.", "book_appointment", {
        name: "TEST Amara Osei",
        phone: "+15550100999",
        treatment: "Teeth Whitening",
        reasonForVisit: "wants a brighter smile before a wedding",
        conversationSummary: "Wedding in six weeks, wants whitening.",
      }),
      text("All booked - your reference is on its way."),
    ]);

    const r = await chat(claudeApp.base, "book me in for whitening, I'm Amara, 555 0100999");
    assert.equal(r.status, 200);

    const row = await prisma.appointment.findFirst({
      where: { name: "TEST Amara Osei" },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(row, "an appointment row must exist");
    assert.equal(row.treatment, "Teeth Whitening");
    assert.equal(row.source, "chatbot");
    assert.equal(row.status, "pending");
    assert.match(row.reference, /^VD-[A-Z0-9]{6}$/);
    assert.equal(row.reasonForVisit, "wants a brighter smile before a wedding");

    // The tool result must be fed back so the model can quote the real reference.
    const followUp = mock.requests.at(-1).body.messages.at(-1);
    const toolResult = followUp.content.find((c) => c.type === "tool_result");
    assert.ok(toolResult, "tool result must be returned to the model");
    assert.ok(
      toolResult.content.includes(row.reference),
      "the real reference must be handed back, not invented",
    );
  });

  test("refuses a tool name that was never advertised", async () => {
    mock.reset();
    mock.setScript([
      textThenTool("sure", "drop_all_appointments", { confirm: true }),
      text("Sorry, I cannot do that."),
    ]);

    const before = await prisma.appointment.count();
    const r = await chat(claudeApp.base, "delete everything");
    const afterCount = await prisma.appointment.count();

    assert.equal(r.status, 200);
    assert.equal(afterCount, before, "an unknown tool must not touch the database");

    const sentBack = mock.requests.at(-1).body.messages.at(-1);
    const toolResult = sentBack.content.find((c) => c.type === "tool_result");
    assert.equal(toolResult.is_error, true);
    assert.match(toolResult.content, /No such tool/i);
  });

  test("replays prior turns so the conversation has memory", async () => {
    mock.reset();
    mock.setScript([text("first"), text("second")]);

    const a = await chat(claudeApp.base, "my name is TEST Rin");
    await chat(claudeApp.base, "what did I just say?", a.sessionId);

    const msgs = mock.requests.at(-1).body.messages;
    assert.ok(msgs.length >= 3, "history must be replayed, not just the latest message");
    assert.ok(
      JSON.stringify(msgs).includes("my name is TEST Rin"),
      "the earlier user turn must be present in context",
    );
  });
});

/* ------------------------------------------------------------------ *
 * Fallback - the brief requires all four failure modes to degrade
 * ------------------------------------------------------------------ */

describe("fallback to the rules engine", () => {
  const SENTINEL = "SENTINEL-ONLY-CLAUDE-WOULD-SAY-THIS";

  for (const [label, failure] of [
    ["rate limit (429)", httpError(429, "rate_limit_error")],
    ["server error (500)", httpError(500, "api_error")],
    ["auth failure (401)", httpError(401, "authentication_error")],
  ]) {
    test(`degrades on ${label} without surfacing an error`, async () => {
      mock.reset();
      mock.setScript([failure]);

      const r = await chat(claudeApp.base, "what are your opening hours?");
      assert.equal(r.status, 200, "the patient must never see an error status");
      assert.ok(r.reply && r.reply.length > 0);
      assert.ok(!r.reply.includes(SENTINEL));
      // The deterministic engine answers hours from the clinic record.
      assert.match(r.reply, /open/i);
    });
  }

  test("runs the rules engine when no API key is configured at all", async () => {
    const r = await chat(rulesApp.base, "hello");
    assert.equal(r.status, 200);
    assert.match(r.reply, /I can help with treatments, prices/i);
  });
});

/* ------------------------------------------------------------------ *
 * Behaviour that must hold whichever engine answers
 * ------------------------------------------------------------------ */

describe("rules engine behaviour", () => {
  test("answers a dental FAQ", async () => {
    const r = await chat(rulesApp.base, "where are you and is there parking?");
    assert.match(r.reply, /South Congress|parking/i);
  });

  test("quotes a price that matches the database", async () => {
    const whitening = await prisma.treatment.findFirst({ where: { name: "Teeth Whitening" } });
    const r = await chat(rulesApp.base, "how much is teeth whitening?");
    assert.ok(whitening.priceFrom);
    assert.ok(
      r.reply.includes(whitening.priceFrom),
      `reply must quote the DB price ${whitening.priceFrom}, got: ${r.reply}`,
    );
  });

  test("a question is never mistaken for a patient name", async () => {
    // Regression: "how much is whitening" has no question mark and is all
    // letters, so it slipped through the name heuristic and the bot replied
    // "Thanks how much is whitening." while a treatment was already on file.
    let sid;
    const first = await chat(rulesApp.base, "I want teeth whitening");
    sid = first.sessionId;

    for (const q of ["how much is whitening", "what are your opening hours", "where are you"]) {
      const r = await chat(rulesApp.base, q, sid);
      assert.ok(
        !/^Thanks /i.test(r.reply),
        `"${q}" was treated as a name, got: ${r.reply}`,
      );
    }

    const priced = await chat(rulesApp.base, "how much is whitening", sid);
    const whitening = await prisma.treatment.findFirst({ where: { name: "Teeth Whitening" } });
    assert.ok(
      priced.reply.includes(whitening.priceFrom) || /open|South Congress|Austin/i.test(priced.reply),
      `a price question must be answered, got: ${priced.reply}`,
    );
  });

  test("completes a multi-turn booking and writes it to the database", async () => {
    let sid;
    let booking = null;
    for (const msg of [
      "I need to book an appointment",
      "teeth whitening please",
      "TEST Devi Kapoor",
      "0400 111 222",
    ]) {
      const r = await chat(rulesApp.base, msg, sid);
      sid = r.sessionId;
      if (r.booking) booking = r.booking;
    }

    assert.ok(booking, "a booking must have been produced");
    const row = await prisma.appointment.findUnique({ where: { reference: booking.reference } });
    assert.ok(row, "the booking reference must exist in the database");
    assert.equal(row.name, "TEST Devi Kapoor");
    assert.equal(row.treatment, "Teeth Whitening");
    assert.equal(row.source, "chatbot");
  });
});

describe("chat widget markup", () => {
  test("renders collapsed - the panel is absent until the launcher is clicked", async () => {
    const html = await (await fetch(rulesApp.base)).text();

    // Regression guard: the panel used to be hidden with the `hidden`
    // attribute while also carrying Tailwind's `flex` class. An author
    // display rule beats the UA stylesheet's [hidden]{display:none}, so the
    // panel rendered permanently open on every page load.
    assert.ok(
      !html.includes("Ask about treatments, prices or booking"),
      "the composer must not be in the initial HTML - the panel should be collapsed",
    );
    assert.ok(
      !html.includes("Typically replies instantly"),
      "the panel header must not be in the initial HTML",
    );
    assert.ok(
      !/hidden=""[^>]*vd-chat-panel|vd-chat-panel[^>]*hidden=""/.test(html),
      "the panel must be conditionally rendered, not hidden with the hidden attribute",
    );

    // The launcher itself must still be there, as a round icon button.
    assert.ok(
      html.includes("Chat with our receptionist"),
      "the launcher button must be present so the widget can be opened",
    );
  });
});

describe("urgency detection", () => {
  const URGENT = [
    "my face is swollen and it is bleeding badly",
    "I knocked out my front tooth",
    "the pain is unbearable",
    "toothache keeping me awake all night",
    "I think I have an abscess",
  ];
  const ORDINARY = ["hello", "how much is whitening", "can I book a check up", "do you take insurance"];

  for (const msg of URGENT) {
    test(`flags: "${msg}"`, async () => {
      const r = await chat(rulesApp.base, msg);
      assert.equal(r.urgent, true);
      assert.match(r.reply, /512.*555.0142/, "must surface the emergency number");
    });
  }

  for (const msg of ORDINARY) {
    test(`does not flag: "${msg}"`, async () => {
      const r = await chat(rulesApp.base, msg);
      assert.equal(r.urgent, false);
    });
  }

  test("urgency fires on the Claude path too, independently of the model", async () => {
    mock.reset();
    mock.setScript([text("Here is some general information.")]);
    const r = await chat(claudeApp.base, "I knocked out my front tooth");
    assert.equal(r.urgent, true);
    assert.match(r.reply, /512.*555.0142/);
  });
});
