/**
 * Field specs for the generic ContentPanel. Treatments, dentists and knowledge
 * items are all "list of records, edit inline, add new" — the only thing that
 * differs is the fields, so they share one panel driven by these specs.
 *
 * Everything here is content the AI receptionist reads on its next reply: edit
 * a price or a policy and the bot is correct immediately, no redeploy.
 */

export type FieldKind = "text" | "textarea" | "number" | "select" | "checkbox";

export interface FieldSpec {
  name: string;
  label: string;
  kind: FieldKind;
  options?: readonly string[];
  placeholder?: string;
  /** Shown in the collapsed row summary. */
  summary?: boolean;
  required?: boolean;
}

export interface ContentSpec {
  /** API path segment, e.g. "treatments". */
  resource: string;
  /** Key the list endpoint returns, e.g. "treatments". */
  listKey: string;
  title: string;
  blurb: string;
  /** Field used as the row heading. */
  titleField: string;
  fields: FieldSpec[];
}

export const TREATMENTS_SPEC: ContentSpec = {
  resource: "treatments",
  listKey: "treatments",
  title: "Treatments & prices",
  blurb:
    "The bot quotes only from this list — edit a price here and it is correct on the next reply.",
  titleField: "name",
  fields: [
    { name: "name", label: "Name", kind: "text", required: true, summary: true },
    {
      name: "category",
      label: "Category",
      kind: "select",
      options: ["general", "cosmetic", "orthodontics", "surgical", "emergency"],
      required: true,
      summary: true,
    },
    { name: "priceFrom", label: "Price", kind: "text", placeholder: "from $390", summary: true },
    { name: "duration", label: "Typical visit", kind: "text", placeholder: "45–60 min" },
    { name: "description", label: "Description", kind: "textarea" },
    {
      name: "keywords",
      label: "Match keywords",
      kind: "text",
      placeholder: "whitening, bleaching, brighter",
    },
    { name: "sortOrder", label: "Order", kind: "number" },
    { name: "active", label: "Visible to the bot", kind: "checkbox" },
  ],
};

export const DENTISTS_SPEC: ContentSpec = {
  resource: "dentists",
  listKey: "dentists",
  title: "Dentists",
  blurb: "Who the receptionist can offer and describe.",
  titleField: "name",
  fields: [
    { name: "name", label: "Name", kind: "text", required: true, summary: true },
    { name: "title", label: "Title", kind: "text", required: true, summary: true },
    { name: "focus", label: "Focus", kind: "text", summary: true },
    { name: "yearsExperience", label: "Years experience", kind: "number" },
    { name: "languages", label: "Languages", kind: "text" },
    { name: "bio", label: "Bio", kind: "textarea" },
    { name: "photo", label: "Photo path", kind: "text", placeholder: "/doctors/name.jpg" },
    { name: "sortOrder", label: "Order", kind: "number" },
    { name: "active", label: "Visible to the bot", kind: "checkbox" },
  ],
};

export const KNOWLEDGE_SPEC: ContentSpec = {
  resource: "knowledge",
  listKey: "knowledge",
  title: "Knowledge base",
  blurb:
    "Policies and FAQs the receptionist answers from. If it is not written here, the bot says it will check with the front desk.",
  titleField: "title",
  fields: [
    { name: "title", label: "Title", kind: "text", required: true, summary: true },
    {
      name: "category",
      label: "Category",
      kind: "select",
      options: ["clinic", "hours", "location", "contact", "policy", "faq", "aftercare", "insurance"],
      required: true,
      summary: true,
    },
    { name: "content", label: "Content", kind: "textarea", required: true },
    { name: "sortOrder", label: "Order", kind: "number" },
    { name: "active", label: "Visible to the bot", kind: "checkbox" },
  ],
};
