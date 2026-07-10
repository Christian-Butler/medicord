export type AppointmentInput = {
  doctorId: string;
  gpId?: string | null;
  referralRequired?: boolean;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  reason?: string;
  startsAt: string;
  endsAt: string;
  location?: string | null;
};

export type Appointment = {
  id: string;
  user_id: string;
  doctor_id: string | null;
  gp_id: string | null;
  referral_required: boolean | null;
  referral_status: "not_required" | "missing" | "provided" | null;
  title: string;
  appointment_type: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string;
  status: "pending" | "confirmed" | "cancelled";
  reason: string | null;
  patient_name: string | null;
  patient_email: string | null;
  patient_phone: string | null;
  created_at: string;
  updated_at: string;
  doctors?: {
    id: string;
    full_name: string;
    specialty: string | null;
    clinic_name?: string | null;
    location?: string | null;
    avatar_url?: string | null;
  } | null;
  gps?: {
    id: string;
    full_name: string;
    practice_name?: string | null;
  } | null;
};