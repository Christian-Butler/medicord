// Matches the check constraint on prescription_renewals.status in Supabase.
export type RenewalStatus = "waiting" | "approved" | "declined";

export type PrescriptionRenewal = {
  id: string;
  created_at: string;
  document_id: string;
  doctor_id: string | null;
  reason: string | null;
  period_start: string | null;
  period_end: string | null;
  status: RenewalStatus;
};

// A document with category "prescription", plus its most recent renewal request.
export type Prescription = {
  id: string;
  title: string;
  doctor_id: string | null;
  created_at: string;
  doctors: { full_name: string } | null;
  latestRenewal: PrescriptionRenewal | null;
};

export type RenewalInput = {
  documentId: string;
  doctorId: string | null;
  reason: string;
  periodStart: Date | null;
  periodEnd: Date | null;
};
