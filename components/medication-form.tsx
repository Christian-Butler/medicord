import type { Medication, MedicationFrequency, MedicationInput } from "@/src/types/medicationTypes";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type MedicationFormProps = {
  medication?: Medication | null;
  saving?: boolean;
  error?: string | null;
  onSubmit: (input: MedicationInput) => Promise<void>;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const daily = ["Morning", "Noon", "Evening"];

type DatePickerTarget = "start" | "end";

const frequencyOptions: { label: string; value: MedicationFrequency }[] = [
  { label: "Once daily", value: "once_daily" },
  { label: "Twice daily", value: "twice_daily" },
  { label: "Three times daily", value: "three_times_daily" },
  { label: "Multiple times daily", value: "multiple_times_daily" },
];

const specifyHours = Array.from({ length: 24 }, (_, i) => {
  return `${String(i).padStart(2, "0")}:00`;
});

export default function MedicationForm({
  medication,
  saving = false,
  error,
  onSubmit,
}: MedicationFormProps) {
  const [name, setName] = useState("");
  const [showPicker, setShowPicker] = useState<DatePickerTarget | null>(null);
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [morningIntake, setMorningIntake] = useState<string[]>([]);
  const [noonIntake, setNoonIntake] = useState<string[]>([]);
  const [eveningIntake, setEveningIntake] = useState<string[]>([]);
  const [noSpecificTime, setNoSpecificTime] = useState(false);
  const [frequency, setFrequency] = useState<MedicationFrequency | null>(null);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);
  const [showHourSelector, setShowHourSelector] = useState(false);
  const [showHourDropdown, setShowHourDropdown] = useState(false);

  useEffect(() => {
    if (!medication) {
      setName("");
      setSelectedDays([]);
      setMorningIntake([]);
      setNoonIntake([]);
      setEveningIntake([]);
      setNoSpecificTime(false);
      setFrequency(null);
      setInstructions([""]);
      setLocalError(null);
      setShowPicker(null);
      setHours([]);
      setShowHourSelector(false);
      setShowHourDropdown(false);

      return;
    }

    setName(medication.name ?? "");
    setSelectedDays(medication.days_frequency ?? []);
    setMorningIntake(medication.morning_intake ?? []);
    setNoonIntake(medication.noon_intake ?? []);
    setEveningIntake(medication.evening_intake ?? []);
    setNoSpecificTime(medication.no_specific_time ?? false);
    setDateStart(medication.date_start ?? new Date());
    setDateEnd(medication.date_end ?? new Date());
    setFrequency((medication.frequency as MedicationFrequency) ?? null);
    setHours(medication.hours ?? []);
    setShowHourSelector((medication.hours ?? []).length > 0);
    setShowHourDropdown(false);
    setInstructions(
      medication.instructions && medication.instructions.length > 0
        ? medication.instructions
        : [""]
    );
    setLocalError(null);
  }, [medication]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(null);
      return;
    }

    if (selectedDate && showPicker === "start") {
      setDateStart(selectedDate);
    } else if (selectedDate && showPicker === "end") {
      setDateEnd(selectedDate);
    }

    if (Platform.OS !== "ios") {
      setShowPicker(null);
    }
  };

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    );
  }

  function toggleHour(hour: string) {
    setHours((current) =>
      current.includes(hour)
        ? current.filter((selectedHour) => selectedHour !== hour)
        : [...current, hour].sort()
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
      daysFrequency: selectedDays,
      morningIntake,
      noonIntake,
      eveningIntake,
      noSpecificTime,
      dateStart,
      dateEnd,
      noSpecificHour: true,
      hours: hours,
      frequency,
      instructions: instructions.map((i) => i.trim()).filter(Boolean),
    });
  }

  const visibleError = localError ?? error;

  const confirm = Boolean(name && selectedDays && dateStart && dateEnd && frequency);

  return (
    <View className="mx-6 pb-16 pt-8">

      {/* Name */}
      <Text className="mr-4 text-[20px] font-medium text-black">Medicine's name</Text>

      <TextInput
        value={name}
        onChangeText={(v) => { setName(v); setLocalError(null); }}
        placeholder="Write the medication's name"
        placeholderTextColor="#7A8A8D"
        className="mt-3 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
      />
      {visibleError ? (
        <Text className="mt-2 text-[16px] text-[#B42318]">{visibleError}</Text>
      ) : null}

      {/* Duration */}
      <Text className="mt-7 mb-3 text-[20px] font-medium text-black">Duration</Text>
      <View className="px-10 gap-3 mt-3 items-center justify-between flex-row">
        <TouchableOpacity
          onPress={() => setShowPicker((current) => current === "start" ? null : "start")}
          className="border border-[#0D5175] rounded-xl p-3 bg-white flex-row justify-between items-center"
        >
          <Text className="text-[16px] text-black">
            {dateStart.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <Text className="text-[16px] font-regular text-black">until</Text>
        <TouchableOpacity
          onPress={() => setShowPicker((current) => current === "end" ? null : "end")}
          className="border border-[#0D5175] rounded-xl p-3 bg-white flex-row justify-between items-center"
        >
          <Text className="text-[16px] text-black">
            {dateEnd.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        {showPicker === "start" && (
          <DateTimePicker
            value={dateStart}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      <View className="items-center">
        {showPicker === "end" && (
          <DateTimePicker
            value={dateEnd}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date(2050, 11, 31)}
          />
        )}
      </View>

      {/* Week */}
      <Text className="mt-7 text-[20px] font-medium text-black">Weekly</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              className={`h-[40px] min-w-[45px] items-center justify-center rounded-xl px-2 ${selected ? "bg-[#0D5175]" : "bg-white"
                } `}
            >
              <Text className={`text-[13px] font-medium ${selected ? "text-white" : "text-[#0D5175]"}`}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>


      {/* Daily */}
      <View>
        <Text className="mt-7 text-[20px] font-medium text-black">Daily</Text>
        <View className="mt-4 flex-row flex-wrap gap-4">
          {frequencyOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setFrequency(option.value)}
              className={`h-[40px] items-center justify-center rounded-[10px] px-6 ${frequency === option.value ? "bg-[#0D5175]" : "bg-white"
                }`}
            >
              <Text className={`text-[14px] font-medium ${frequency === option.value ? "text-white" : "text-[#0D5175]"}`}>
                {option.label}
              </Text>
            </Pressable>
          ))}
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
              onPress={() => !noSpecificTime && toggleDay(time)}
              disabled={noSpecificTime}
              className={`px-6 h-[40px] items-center justify-center rounded-xl ${selected ? "bg-[#0D5175]" : "bg-white"
                } ${noSpecificTime ? "opacity-50" : ""}`}
            >
              <Text className={`text-[16px] font-medium ${selected ? "text-white" : "text-[#0D5175]"}`}>
                {time}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Hours specify */}
      <View className="mt-3 flex-row items-center gap-2">
        {showHourSelector && (
          <Pressable
            disabled={noSpecificTime}
            onPress={() => setShowHourDropdown((previous) => !previous)}
            className={`mt-4 min-w-0 flex-1 h-[46px] flex-row items-center rounded-[12px] border border-[#0D5175] bg-white px-3 ${noSpecificTime ? "opacity-50" : ""}`}
          >
            <Text numberOfLines={1} className="mr-2 flex-1 text-[14px] text-black">
              {hours.length > 0 ? hours.join(", ") : "Select hours"}
            </Text>
            <ChevronDown size={20} color="#0D5175" />
          </Pressable>
        )}

        <Pressable
          disabled={noSpecificTime}
          onPress={() => setShowHourSelector(true)}
          className={`mt-4 h-[46px] w-[160px] flex-row items-center justify-center rounded-[12px] bg-[#5085A8] px-4 ${noSpecificTime ? "opacity-50" : ""}`}
        >
          <Plus size={18} color="white" />
          <Text className="ml-1 text-[16px] font-medium text-white">Specify hours</Text>
        </Pressable>

      </View>

      {/* Dropdown hours */}
      {showHourDropdown && !noSpecificTime && (
        <ScrollView
          nestedScrollEnabled
          className="mt-2 max-h-[240px] rounded-[14px] border border-[#0D5175] bg-white"
        >
          {specifyHours.map((hour) => {
            const selected = hours.includes(hour);
            return (
              <Pressable
                key={hour}
                onPress={() => toggleHour(hour)}
                className={`min-h-[44px] flex-row items-center justify-between border-b border-[#E3EBEF] px-4 ${selected ? "bg-[#EAF3F7]" : ""}`}
              >
                <Text className="text-[16px] text-black">{hour}</Text>
                {selected ? <Check size={18} color="#0D5175" /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* No specific time */}
      <View className="mt-6 flex-row items-center">
        <Pressable
          onPress={() => setNoSpecificTime((p) => !p)}
          className="flex-row items-center"
        >
          <View className={`h-[20px] w-[20px] rounded-[4px] border border-[#0D5175] ${noSpecificTime ? "bg-[#0D5175]" : "bg-transparent"}`} />
          <Text className="ml-2 text-[14px] text-black">No time window needed.</Text>
        </Pressable>

      </View>

      {/* Instructions */}
      <Text className="mt-8 text-[20px] font-medium text-black">Instructions</Text>
      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          value={instruction}
          onChangeText={(v) => updateInstruction(index, v)}
          placeholder="ex. Take with food"
          placeholderTextColor="#7A8A8D"
          className="mt-3 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
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
        disabled={!confirm || saving}
        onPress={handleSubmit}
        className={`mt-10  mb-20 h-[50px] items-center justify-center rounded-[14px] bg-[#17A633] ${saving ? "opacity-60" : !confirm ? "opacity-60 bg-[gray]" : ""}`}
      >
        <Text className="text-[16px] font-medium text-white">
          {saving ? "Saving..." : medication ? "Confirm update" : "Confirm routine creation"}
        </Text>
      </Pressable>
    </View>
  );
}
