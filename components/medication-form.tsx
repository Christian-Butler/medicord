import type { Medication, MedicationFrequency, MedicationInput } from "@/src/types/medicationTypes";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type MedicationFormProps = {
  medication?: Medication | null;
  saving?: boolean;
  error?: string | null;
  onSubmit: (input: MedicationInput) => Promise<void>;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const daily = ["Morning", "Noon", "Evening"];


const frequencyOptions: { label: string; value: MedicationFrequency }[] = [
  { label: "Once daily", value: "once_daily" },
  { label: "Twice daily", value: "twice_daily" },
  { label: "Three times daily", value: "three_times_daily" },
  { label: "Multiple times daily", value: "long_term" },
];

export default function MedicationForm({
  medication,
  saving = false,
  error,
  onSubmit,
}: MedicationFormProps) {
  const [name, setName] = useState("");
  const [monthsDuration, setMonthsDuration] = useState(0);
  const [weeksDuration, setWeeksDuration] = useState(0);
  const [daysDuration, setDaysDuration] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [morningFrequency, setMorningFrequency] = useState(0);
  const [noonFrequency, setNoonFrequency] = useState(0);
  const [eveningFrequency, setEveningFrequency] = useState(0);
  const [noSpecificTime, setNoSpecificTime] = useState(false);
  const [frequency, setFrequency] = useState<MedicationFrequency | null>(null);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!medication) {
      setName("");
      setMonthsDuration(0);
      setWeeksDuration(0);
      setDaysDuration(0);
      setSelectedDays([]);
      setMorningFrequency(0);
      setNoonFrequency(0);
      setEveningFrequency(0);
      setNoSpecificTime(false);
      setFrequency(null);
      setInstructions([""]);
      setLocalError(null);
      return;
    }

    setName(medication.name ?? "");
    setMonthsDuration(medication.months_duration ?? 0);
    setWeeksDuration(medication.weeks_duration ?? 0);
    setDaysDuration(medication.days_duration ?? 0);
    setSelectedDays(medication.days_frequency ?? []);
    setMorningFrequency(medication.morning_frequency ?? 0);
    setNoonFrequency(medication.noon_frequency ?? 0);
    setEveningFrequency(medication.evening_frequency ?? 0);
    setNoSpecificTime(medication.no_specific_time ?? false);
    setSelectedTime([""]);
    setFrequency((medication.frequency as MedicationFrequency) ?? null);
    setInstructions(
      medication.instructions && medication.instructions.length > 0
        ? medication.instructions
        : [""]
    );
    setLocalError(null);
  }, [medication]);

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    );
  }

  function toggleTime(time: string) {
    setSelectedTime((current) =>
      current.includes(time) ? current.filter((t) => t !== time) : [...current, time]
    );
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((current) =>
      current.map((item, i) => (i === index ? value : item))
    );
  }

  function addInstruction() {
    setInstructions((current) => [...current, ""]);
  }

  async function handleSubmit() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("Please enter a medication name.");
      return;
    }
    setLocalError(null);

    await onSubmit({
      name: trimmedName,
      monthsDuration,
      weeksDuration,
      daysDuration,
      daysFrequency: selectedDays,
      morningFrequency,
      noonFrequency,
      eveningFrequency,
      noSpecificTime,
      noSpecificHour: true,
      hours: [],
      frequency,
      instructions: instructions.map((i) => i.trim()).filter(Boolean),
    });
  }

  const visibleError = localError ?? error;

  return (
    <View className="mx-6 pb-16 pt-8">

      {/* Name */}
      <Text className="mr-4 text-[20px] font-medium text-black">Name</Text>

      <TextInput
        value={name}
        onChangeText={(v) => { setName(v); setLocalError(null); }}
        placeholder="Enter a name"
        placeholderTextColor="#7A8A8D"
        className="mt-3 h-[56px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
      />
      {visibleError ? (
        <Text className="mt-2 text-[16px] text-[#B42318]">{visibleError}</Text>
      ) : null}

      {/* Duration */}
      <Text className="mt-7 text-[21px] font-medium text-black">Duration</Text>
      <View className="mt-3 flex-row gap-3">
        {/* 
        <View className="flex-1">
          <SpinnerPickerField label="Month(s)" value={monthsDuration} max={24} onChange={setMonthsDuration} />
        </View>
        <View className="flex-1">
          <SpinnerPickerField label="Week(s)" value={weeksDuration} max={52} onChange={setWeeksDuration} />
        </View>
        <View className="flex-1">
          <SpinnerPickerField label="Day(s)" value={daysDuration} max={31} onChange={setDaysDuration} />
        </View>
        */}
      </View>

      {/* Days */}
      <Text className="mt-7 text-[20px] font-medium text-black">Weekly</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              disabled={noSpecificTime}
              className={`h-[43px] min-w-[45px] items-center justify-center rounded-xl px-2 ${selected ? "bg-[#0D5175]" : "bg-white"
                } `}
            >
              <Text className={`text-[13px] font-medium ${selected ? "text-white" : "text-[#0D5175]"}`}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>


      {/* Time */}
      <Text className="mt-7 text-[20px] font-medium text-black">Daily</Text>

      <View className="mt-4 flex-row flex-wrap gap-4">
        {frequencyOptions.map((option) => (
          <Pressable
            key={option.value}
            disabled={noSpecificTime}
            onPress={() => !noSpecificTime && setFrequency(option.value)}
            className={`h-[40px] items-center justify-center rounded-[10px] px-6 ${frequency === option.value ? "bg-[#0D5175]" : "bg-white"
              } ${noSpecificTime ? "opacity-50" : ""}`}
          >
            <Text className={`text-[14px] font-medium ${frequency === option.value ? "text-white" : "text-[#0D5175]"}`}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>


      {/* Morning / Noon / Evening */}
      <View className="mt-5 flex-row gap-3">
        <View className="flex-1">

          {/* 
          <Text className="mb-2 text-[14px] text-[#555]">Morning Intake</Text>
          <SpinnerPickerField label="pills" value={morningFrequency} max={10} onChange={setMorningFrequency} disabled={noSpecificTime} />
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-[14px] text-[#555]">Noon Intake</Text>
          <SpinnerPickerField label="pills" value={noonFrequency} max={10} onChange={setNoonFrequency} disabled={noSpecificTime} />
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-[14px] text-[#555]">Evening Intake</Text>
          <SpinnerPickerField label="pills" value={eveningFrequency} max={10} onChange={setEveningFrequency} disabled={noSpecificTime} />
          */}
        </View>
      </View>

      {/* Intake Frequency */}
      <Text className="mt-4 text-[20px] font-medium text-black">Time window</Text>
      <View className="mt-3 flex-row flex-wrap gap-4">
        {daily.map((time) => {
          const selected = selectedDays.includes(time);
          return (
            <Pressable
              key={time}
              onPress={() => toggleDay(time)}
              disabled={noSpecificTime}
              className={`px-6 h-[40px] items-center justify-center rounded-xl ${selected ? "bg-[#0D5175]" : "bg-white"
                } `}
            >
              <Text className={`text-[16px] font-medium ${selected ? "text-white" : "text-[#0D5175]"}`}>
                {time}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6 justify-between flex-row items-center">
        {/* No specific time */}
        <Pressable
          onPress={() => setNoSpecificTime((p) => !p)}
          className="flex-row items-center"
        >
          <View className={`h-[20px] w-[20px] rounded-[4px] border border-[#0D5175] ${noSpecificTime ? "bg-[#0D5175]" : "bg-transparent"}`} />
          <Text className="ml-2 text-[14px] text-black">No time window needed.</Text>
        </Pressable>

        <Pressable
          onPress={addInstruction}
          className="h-[46px] flex-row items-center justify-center self-end rounded-[12px] bg-[#5085A8] px-6"
        >
          <Plus size={20} color="white" />
          <Text className="ml-2 text-[16px] font-medium text-white">Specify hour</Text>
        </Pressable>
      </View>


      {/* Instructions */}
      <Text className="mt-8 text-[21px] font-medium text-black">Instructions</Text>
      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          value={instruction}
          onChangeText={(v) => updateInstruction(index, v)}
          placeholder="ex. Take with food"
          placeholderTextColor="#7A8A8D"
          className="mt-3 h-[56px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />
      ))}

      <Pressable
        onPress={addInstruction}
        className="mt-4 h-[46px] flex-row items-center justify-center self-end rounded-[12px] bg-[#5085A8] px-6"
      >
        <Plus size={20} color="white" />
        <Text className="ml-2 text-[16px] font-medium text-white">Add instruction</Text>
      </Pressable>

      <Pressable
        disabled={saving}
        onPress={handleSubmit}
        className={`mt-10  mb-20 h-[50px] items-center justify-center rounded-[14px] bg-[#17A633] ${saving ? "opacity-60" : ""}`}
      >
        <Text className="text-[16px] font-medium text-white">
          {saving ? "Saving..." : medication ? "Confirm update" : "Confirm routine creation"}
        </Text>
      </Pressable>
    </View>
  );
}