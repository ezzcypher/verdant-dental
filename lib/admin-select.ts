/** Fields the admin API is allowed to return for an appointment.
 *  Never includes `sourceIpHash`. */
export const APPOINTMENT_ADMIN_FIELDS = {
  id: true,
  reference: true,
  name: true,
  phone: true,
  email: true,
  treatment: true,
  note: true,
  reasonForVisit: true,
  preferredDate: true,
  preferredTime: true,
  conversationSummary: true,
  source: true,
  status: true,
  chatSessionId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const CHAT_SESSION_ADMIN_FIELDS = {
  id: true,
  publicId: true,
  status: true,
  leadStatus: true,
  patientName: true,
  preferredDentist: true,
  treatment: true,
  preferredDate: true,
  preferredTime: true,
  contactPhone: true,
  contactEmail: true,
  reasonForVisit: true,
  summary: true,
  urgentFlag: true,
  createdAt: true,
  lastActivityAt: true,
} as const;

export const CONTACT_ADMIN_FIELDS = {
  id: true,
  name: true,
  email: true,
  subject: true,
  body: true,
  handled: true,
  createdAt: true,
} as const;
