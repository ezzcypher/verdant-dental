import { createServer } from "node:http";

/**
 * A stand-in for api.anthropic.com/v1/messages.
 *
 * The Anthropic SDK honours the ANTHROPIC_BASE_URL environment variable, so
 * pointing the app at this server exercises the entire real Claude code path -
 * request construction, the tool loop, tool execution against the real
 * database, and reply assembly - without a live API key or a paid call.
 *
 * `script` is an array of responses returned in order, one per HTTP request, so
 * a multi-step tool conversation can be played out deterministically.
 */
export function startMockAnthropic({ script = [], port = 0 } = {}) {
  const requests = [];
  let i = 0;

  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      let parsed = null;
      try {
        parsed = JSON.parse(body);
      } catch {
        /* recorded as null */
      }
      requests.push({ url: req.url, headers: req.headers, body: parsed });

      const next = script[i] ?? script[script.length - 1];
      i += 1;

      // Allow a scripted HTTP failure (rate limit, 5xx) to be simulated.
      if (next && next.__status && next.__status !== 200) {
        res.writeHead(next.__status, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            type: "error",
            error: { type: next.__errorType ?? "api_error", message: "mock failure" },
          }),
        );
        return;
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(message(next)));
    });
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const { port: actual } = server.address();
      resolve({
        url: `http://127.0.0.1:${actual}`,
        requests,
        reset: () => {
          i = 0;
          requests.length = 0;
        },
        setScript: (s) => {
          script = s;
          i = 0;
        },
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

/** Wrap scripted content into a well-formed Messages API response. */
function message(spec) {
  const content = spec?.content ?? [{ type: "text", text: "ok" }];
  const stop =
    spec?.stop_reason ?? (content.some((b) => b.type === "tool_use") ? "tool_use" : "end_turn");
  return {
    id: "msg_mock_" + Math.random().toString(36).slice(2, 10),
    type: "message",
    role: "assistant",
    model: "claude-opus-5",
    content,
    stop_reason: stop,
    stop_sequence: null,
    usage: { input_tokens: 100, output_tokens: 20 },
  };
}

export const text = (t) => ({ content: [{ type: "text", text: t }] });

export const toolUse = (name, input, id = "toolu_mock_1") => ({
  content: [{ type: "tool_use", id, name, input }],
  stop_reason: "tool_use",
});

export const textThenTool = (t, name, input, id = "toolu_mock_1") => ({
  content: [
    { type: "text", text: t },
    { type: "tool_use", id, name, input },
  ],
  stop_reason: "tool_use",
});

export const httpError = (status, errorType) => ({
  __status: status,
  __errorType: errorType,
});
