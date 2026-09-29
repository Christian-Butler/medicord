import { Picker } from "@react-native-picker/picker";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { Medication, MedicationFrequency, MedicationInput } from "@/src/types/medicationTypes";

type MedicationFormProps = {
  medication?: Medication | null;
  saving?: boolean;
  error?: string | null;
  onSubmit: (input: MedicationInput) => Promise<void>;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const frequencyOptions: { label: string; value: MedicationFrequency }[] = [
  { label: "As needed", value: "as_needed" },
  { label: "Once daily", value: "once_daily" },
  { label: "Twice daily", value: "twice_daily" },
  { label: "Three times daily", value: "three_times_daily" },
  { label: "Long term / Ongoing", value: "long_term" },
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

  const range = (n: number) => Array.from({ length: n + 1 }, (_, i) => i);

  return (
    <View className="px-6 pb-16 pt-8">

      {visibleError ? (
        <Text className="mt-6 text-[15px] text-[#B42318]">{visibleError}</Text>
      ) : null}

      <Text className="mt-8 text-[21px] font-medium text-black">Name</Text>
      <TextInput
        value={name}
        onChangeText={(v) => { setName(v); setLocalError(null); }}
        placeholder="Enter a name"
        placeholderTextColor="#7A8A8D"
        className="mt-3 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
      />

      {/* Duration */}
      <Text className="mt-7 text-[21px] font-medium text-black">Duration</Text>
      <View className="mt-3 flex-row gap-3">
        <View className="flex-1">
          <Text className="mb-1 text-[13px] text-[#555]">Months</Text>
          <View className="rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker selectedValue={monthsDuration} onValueChange={setMonthsDuration}>
              {range(24).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-[13px] text-[#555]">Weeks</Text>
          <View className="rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker selectedValue={weeksDuration} onValueChange={setWeeksDuration}>
              {range(52).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-[13px] text-[#555]">Days</Text>
          <View className="rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker selectedValue={daysDuration} onValueChange={setDaysDuration}>
              {range(31).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Days */}
      <Text className="mt-7 text-[21px] font-medium text-black">Days</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              disabled={noSpecificTime}
              className={`h-[43px] min-w-[45px] items-center justify-center rounded-[7px] border-[2px] border-[#0D5175] px-2 ${
                selected ? "bg-[#0D5175]" : "bg-white"
              } ${noSpecificTime ? "opacity-50" : ""}`}
            >
              <Text className={`text-[13px] font-medium ${selected ? "text-white" : "text-[#0D5175]"}`}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Morning / Noon / Evening */}
      <View className="mt-7 flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="mb-1 text-[13px] text-[#555]">Morning</Text>
          <View className="w-full rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker
              selectedValue={morningFrequency}
              onValueChange={setMorningFrequency}
              enabled={!noSpecificTime}
            >
              {range(10).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1 items-center px-2">
          <Text className="mb-1 text-[13px] text-[#555]">Noon</Text>
          <View className="w-full rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker
              selectedValue={noonFrequency}
              onValueChange={setNoonFrequency}
              enabled={!noSpecificTime}
            >
              {range(10).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-1 items-center">
          <Text className="mb-1 text-[13px] text-[#555]">Evening</Text>
          <View className="w-full rounded-[10px] border-[2px] border-[#9BA8AB] bg-white">
            <Picker
              selectedValue={eveningFrequency}
              onValueChange={setEveningFrequency}
              enabled={!noSpecificTime}
            >
              {range(10).map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => setNoSpecificTime((p) => !p)}
        className="mt-7 flex-row items-center"
      >
        <View className={`h-[22px] w-[22px] rounded-[4px] border-[2px] border-black ${noSpecificTime ? "bg-[#0D5175]" : "bg-transparent"}`} />
        <Text className="ml-3 text-[16px] text-black">No specific time of the day.</Text>
      </Pressable>

      {/* Intake Frequency */}
      <Text className="mt-7 text-[21px] font-medium text-black">Intake Frequency</Text>
      <View className="mt-4 flex-row flex-wrap gap-3">
        {frequencyOptions.map((option) => (
          <Pressable
            key={option.value}
            disabled={noSpecificTime}
            onPress={() => !noSpecificTime && setFrequency(option.value)}
            className={`h-[43px] items-center justify-center rounded-[10px] border-[2px] border-[#0D5175] px-4 ${
              frequency === option.value ? "bg-[#0D5175]" : "bg-white"
            } ${noSpecificTime ? "opacity-50" : ""}`}
          >
            <Text className={`text-[14px] font-medium ${frequency === option.value ? "text-white" : "text-[#0D5175]"}`}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Instructions */}
      <Text className="mt-8 text-[21px] font-medium text-black">Other instructions</Text>
      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          value={instruction}
          onChangeText={(v) => updateInstruction(index, v)}
          placeholder="ex. Number of pills a day"
          placeholderTextColor="#7A8A8D"
          className="mt-3 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />
      ))}

      <Pressable
        onPress={addInstruction}
        className="mt-4 h-[50px] flex-row items-center justify-center self-end rounded-[12px] border-[2px] border-[#0D5175] bg-white px-6"
      >
        <Plus size={20} color="#0D5175" />
        <Text className="ml-2 text-[17px] font-medium text-[#0D5175]">Add Instruction</Text>
      </Pressable>

      <Pressable
        disabled={saving}
        onPress={handleSubmit}
        className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${saving ? "opacity-60" : ""}`}
      >
        <Text className="text-[17px] font-semibold text-white">
          {saving ? "Saving..." : medication ? "Confirm update" : "Confirm creation"}
        </Text>
      </Pressable>
    </View>
  );
}