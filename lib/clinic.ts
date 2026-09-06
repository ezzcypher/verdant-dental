/**
 * Static clinic facts the receptionist can always state, even with an empty
 * knowledge base. Anything the clinic edits day-to-day lives in KnowledgeItem
 * instead — this is only the handful of things that are structural.
 *
 * DEMO CONTENT: Verdant is a portfolio demonstration. The address and phone
 * number below are placeholders (Austin, TX; 555 exchange).
 */
export const CLINIC = {
  name: "Verdant",
  fullName: "Verdant Family & Cosmetic Dentistry",
  address: "1400 South Congress Avenue, Suite 210, Austin, TX 78704",
  phone: "(512) 555-0142",
  email: "hello@verdantdental.com",
  hours: [
    { days: "Monday – Thursday", time: "8:00 AM – 5:00 PM" },
    { days: "Friday", time: "8:00 AM – 2:00 PM" },
    { days: "Saturday", time: "By appointment" },
    { days: "Sunday", time: "Closed" },
  ],
  emergencyLine: "(512) 555-0142",
} as const;

export function hoursAsText(): string {
  return CLINIC.hours.map((h) => `${h.days}: ${h.time}`).join("; ");
}
