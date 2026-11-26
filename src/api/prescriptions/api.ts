import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import type {
  Prescription,
  PrescriptionRenewal,
  RenewalInput,
} from "@/src/types/prescriptionTypes";
import { supabase } from "@/supabase/supabase";

const renewalSelect = `
  id,
  created_at,
  document_id,
  doctor_id,
  reason,
  period_start,
  period_end,
  status
`;

// Prescription documents, the issuing doctor's name, and every renewal request for each one.
const prescriptionSelect = `
  id,
  title,
  doctor_id,
  created_at,
  doctors(full_name),
  prescription_renewals(${renewalSelect})
`;

// There's no doctor-side app, so a request counts as approved once it has waited this long.
// Simulated for testing and assessment; the row in Supabase stays "waiting".
export const SIMULATED_APPROVAL_MINUTES = 2;

function withSimulatedApproval(
  renewal: PrescriptionRenewal | null,
): PrescriptionRenewal | null {
  if (!renewal || renewal.status !== "waiting") return renewal;

  const waitedMs = Date.now() - new Date(renewal.created_at).getTime();

  return waitedMs >= SIMULATED_APPROVAL_MINUTES * 60 * 1000
    ? { ...renewal, status: "approved" }
    : renewal;
}

function dateOnly(value: Date | null | undefined) {
  if (!value) return null;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getMyPrescriptions(): Promise<Prescription[]> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("documents")
    .select(prescriptionSelect)
    .eq("user_id", userId)
    .eq("category", "prescription")
    .order("created_at", { ascending: false })
    .order("created_at", {
      referencedTable: "prescription_renewals",
      ascending: false,
    });

  if (error) throw error;

  // Renewals come back newest first, so the first one is the latest request.
  return (data ?? []).map((row: any) => {
    const { prescription_renewals, ...document } = row;
    return {
      ...document,
      latestRenewal: withSimulatedApproval(
        (prescription_renewals?.[0] ?? null) as PrescriptionRenewal | null,
      ),
    } as Prescription;
  });
}

export async function requestRenewal(
  input: RenewalInput,
): Promise<PrescriptionRenewal> {
  const userId = await getCurrentAppUserId();

  // Goes to the doctor who issued the prescription, or the user's GP if the document has no doctor.
  let doctorId = input.doctorId;

  if (!doctorId) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("gp_id")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    doctorId = profile?.gp_id ?? null;
  }

  const { data, error } = await supabase
    .from("prescription_renewals")
    .insert({
      user_id: userId,
      document_id: input.documentId,
      doctor_id: doctorId,
      reason: input.reason.trim() || null,
      period_start: dateOnly(input.periodStart),
      period_end: dateOnly(input.periodEnd),
    })
    .select(renewalSelect)
    .single();

  if (error) throw error;

  return data as PrescriptionRenewal;
}
