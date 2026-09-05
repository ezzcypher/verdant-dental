export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** Details the receptionist has collected so far in this conversation. */
export interface CollectedDetails {
  patientName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  treatment?: string | null;
  preferredDentist?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  reasonForVisit?: string | null;
}

export interface TreatmentInfo {
  name: string;
  category: string;
  description: string | null;
  priceFrom: string | null;
  duration: string | null;
  keywords: string | null;
}

export interface DentistInfo {
  name: string;
  title: string;
  focus: string | null;
  yearsExperience: number | null;
  languages: string | null;
}

export interface KnowledgeInfo {
  category: string;
  title: string;
  content: string;
}

/** Everything the model is allowed to answer from, loaded fresh each turn. */
export interface ClinicContext {
  treatments: TreatmentInfo[];
  dentists: DentistInfo[];
  knowledge: KnowledgeInfo[];
}

/** What a booking attempt produced, so the route can surface it to the UI. */
export interface BookingResult {
  reference: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
}

export interface ReceptionistResult {
  reply: string;
  /** Fields the engine wants persisted back onto the ChatSession. */
  collected: CollectedDetails;
  booking: BookingResult | null;
  leadStatus: "browsing" | "interested" | "booking" | "converted";
  urgent: boolean;
  /** "claude" when the live model answered, "rules" when the fallback did. */
  engine: "claude" | "rules";
}
