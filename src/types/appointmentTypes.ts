export type CreateAppointmentInput = {
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