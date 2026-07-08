export type Medication = {
  id: number;
  created_at: string;
  name: string | null;
  no_specific_time: boolean | null;
  no_specific_hour: boolean | null;
  instructions: string[] | null;
  user_id: string | null;
  hours: number[] | null;
  days_frequency: string[] | null;
  months_duration: number | null;
  weeks_duration: number | null;
  days_duration: number | null;
  morning_frequency: number | null;
  noon_frequency: number | null;
  evening_frequency: number | null;
};