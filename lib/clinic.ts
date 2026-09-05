/**
 * Static clinic facts the receptionist can always state, even with an empty
 * knowledge base. Anything the clinic edits day-to-day lives in KnowledgeItem
 * instead — this is only the handful of things that are structural.
 */
export const CLINIC = {
  name: "Verdant",
  fullName: "Verdant — Dental Atelier",
  address: "24 Lindenhof Passage, City Centre",
  phone: "+1 (555) 018-2245",
  email: "front.desk@verdant.dental",
  hours: [
    { days: "Monday – Thursday", time: "8:00 – 19:00" },
    { days: "Friday", time: "8:00 – 16:00" },
    { days: "Saturday", time: "9:00 – 14:00" },
    { days: "Sunday", time: "Closed" },
  ],
  emergencyLine: "+1 (555) 018-2245",
} as const;

export function hoursAsText(): string {
  return CLINIC.hours.map((h) => `${h.days}: ${h.time}`).join("; ");
}
