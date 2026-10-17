export type MedicationFrequency =
  | "once_daily"
  | "twice_daily"
  | "three_times_daily"
  | "multiple_times_daily";

export type Medication = {
  id: number;
  created_at: string;
  name: string | null;
  no_specific_time: boolean | null;
  instructions: string[] | null;
  user_id: string | null;
  hours: number[] | null;
  days_frequency: string[] | null;
  morning_intake: string[] | null;
  noon_intake: string[] | null;
  evening_intake: string[] | null;
  frequency: string | null;
};
export type MedicationInput = {
  name: string;
  noSpecificTime?: boolean;
  noSpecificHour?: boolean;
  instructions?: string[];
  hours?: number[];
  daysFrequency?: string[];
  morningIntake: string[] | null;
  noonIntake: string[] | null;
  eveningIntake: string[] | null;
  frequency?: MedicationFrequency | null;
};