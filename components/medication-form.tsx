import type { Medication, MedicationInput } from "@/src/types/medicationTypes";
import { MaterialIcons } from "@expo/vector-icons";
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

function numberToString(value?: number | null) {
  return value === null || value === undefined ? "0" : String(value);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function incrementValue(value: string, max: number) {
  return String(clamp(toNumber(value) + 1, 0, max));
}

function decrementValue(value: string, max: number) {
  return String(clamp(toNumber(value) - 1, 0, max));
}

function formatHour(value: string) {
  const safeHour = clamp(toNumber(value), 0, 23);
  return `${String(safeHour).padStart(2, "0")}:00`;
}

export default function MedicationForm({
  medication,
  saving = false,
  error,
  onSubmit,
}: MedicationFormProps) {
  const [name, setName] = useState("");
  const [monthsDuration, setMonthsDuration] = useState("0");
  const [weeksDuration, setWeeksDuration] = useState("0");
  const [daysDuration, setDaysDuration] = useState("0");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [morningFrequency, setMorningFrequency] = useState("0");
  const [noonFrequency, setNoonFrequency] = useState("0");
  const [eveningFrequency, setEveningFrequency] = useState("0");
  const [noSpecificTime, setNoSpecificTime] = useState(false);
  const [hours, setHours] = useState<string[]>(["0"]);
  const [noSpecificHour, setNoSpecificHour] = useState(false);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!medication) {
      setName("");
      setMonthsDuration("0");
      setWeeksDuration("0");
      setDaysDuration("0");
      setSelectedDays([]);
      setMorningFrequency("0");
      setNoonFrequency("0");
      setEveningFrequency("0");
      setNoSpecificTime(false);
      setHours(["0"]);
      setNoSpecificHour(false);
      setInstructions([""]);
      setLocalError(null);
      return;
    }

    setName(medication.name ?? "");
    setMonthsDuration(numberToString(medication.months_duration));
    setWeeksDuration(numberToString(medication.weeks_duration));
    setDaysDuration(numberToString(medication.days_duration));
    setSelectedDays(medication.days_frequency ?? []);
    setMorningFrequency(numberToString(medication.morning_frequency));
    setNoonFrequency(numberToString(medication.noon_frequency));
    setEveningFrequency(numberToString(medication.evening_frequency));
    setNoSpecificTime(medication.no_specific_time ?? false);
    setHours(
      medication.hours && medication.hours.length > 0
        ? medication.hours.map((hour) => String(hour))
        : ["0"]
    );
    setNoSpecificHour(medication.no_specific_hour ?? false);
    setInstructions(
      medication.instructions && medication.instructions.length > 0
        ? medication.instructions
        : [""]
    );
    setLocalError(null);
  }, [medication]);

  function toggleDay(day: string) {
    setSelectedDays((current) => {
      if (current.includes(day)) {
        return current.filter((item) => item !== day);
      }

      return [...current, day];
    });
  }

  function updateHour(index: number, value: string) {
    setHours((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  }

  function addHour() {
    setHours((current) => [...current, "0"]);
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
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
      monthsDuration: toNumber(monthsDuration),
      weeksDuration: toNumber(weeksDuration),
      daysDuration: toNumber(daysDuration),
      daysFrequency: selectedDays,
      morningFrequency: toNumber(morningFrequency),
      noonFrequency: toNumber(noonFrequency),
      eveningFrequency: toNumber(eveningFrequency),
      noSpecificTime,
      noSpecificHour,
      hours: noSpecificHour ? [] : hours.map(toNumber),
      instructions: instructions.map((item) => item.trim()).filter(Boolean),
    });
  }

  const visibleError = localError ?? error;

  return (
    <View className="px-6 pb-16 pt-8">
      <View className="items-center">
        <MaterialIcons name="medication" size={82} color="#075B7A" />

        <Text className="mt-5 text-[22px] font-medium text-black">
          Medication Type
        </Text>

        <Text className="mt-1 text-[14px] text-black">
          Click to change image
        </Text>
      </View>

      {visibleError ? (
        <Text className="mt-6 text-[15px] text-[#B42318]">
          {visibleError}
        </Text>
      ) : null}

      <Text className="mt-8 text-[21px] font-medium text-black">Name</Text>

      <TextInput
        value={name}
        onChangeText={(value) => {
          setName(value);
          setLocalError(null);
        }}
        placeholder="Enter a name"
        placeholderTextColor="#7A8A8D"
        className="mt-3 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
      />

      <Text className="mt-7 text-[21px] font-medium text-black">Duration</Text>

      <View className="mt-3 flex-row gap-3">
        <StepperBox
          value={`${monthsDuration} Month(s)`}
          onIncrement={() =>
            setMonthsDuration((current) => incrementValue(current, 24))
          }
          onDecrement={() =>
            setMonthsDuration((current) => decrementValue(current, 24))
          }
        />

        <StepperBox
          value={`${weeksDuration} Week(s)`}
          onIncrement={() =>
            setWeeksDuration((current) => incrementValue(current, 52))
          }
          onDecrement={() =>
            setWeeksDuration((current) => decrementValue(current, 52))
          }
        />

        <StepperBox
          value={`${daysDuration} Day(s)`}
          onIncrement={() =>
            setDaysDuration((current) => incrementValue(current, 31))
          }
          onDecrement={() =>
            setDaysDuration((current) => decrementValue(current, 31))
          }
        />
      </View>

      <Text className="mt-7 text-[21px] font-medium text-black">
        Frequency
      </Text>

      <View className="mt-3 flex-row flex-wrap gap-2">
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day);

          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              className={`h-[43px] min-w-[45px] items-center justify-center rounded-[7px] border-[2px] border-[#0D5175] px-2 ${
                selected ? "bg-[#0D5175]" : "bg-white"
              }`}
            >
              <Text
                className={`text-[13px] font-medium ${
                  selected ? "text-white" : "text-[#0D5175]"
                }`}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-7 flex-row justify-between">
        <View className="items-center">
          <StepperBox
            widthClassName="w-[74px]"
            value={morningFrequency}
            onIncrement={() =>
              setMorningFrequency((current) => incrementValue(current, 10))
            }
            onDecrement={() =>
              setMorningFrequency((current) => decrementValue(current, 10))
            }
          />

          <Text className="mt-2 text-center text-[14px] text-black">
            Morning Intake
          </Text>
        </View>

        <View className="items-center">
          <StepperBox
            widthClassName="w-[74px]"
            value={noonFrequency}
            onIncrement={() =>
              setNoonFrequency((current) => incrementValue(current, 10))
            }
            onDecrement={() =>
              setNoonFrequency((current) => decrementValue(current, 10))
            }
          />

          <Text className="mt-2 text-center text-[14px] text-black">
            Noon Intake
          </Text>
        </View>

        <View className="items-center">
          <StepperBox
            widthClassName="w-[74px]"
            value={eveningFrequency}
            onIncrement={() =>
              setEveningFrequency((current) => incrementValue(current, 10))
            }
            onDecrement={() =>
              setEveningFrequency((current) => decrementValue(current, 10))
            }
          />

          <Text className="mt-2 text-center text-[14px] text-black">
            Evening Intake
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => setNoSpecificTime((current) => !current)}
        className="mt-7 flex-row items-center"
      >
        <View
          className={`h-[22px] w-[22px] rounded-[4px] border-[2px] border-black ${
            noSpecificTime ? "bg-[#0D5175]" : "bg-transparent"
          }`}
        />

        <Text className="ml-3 text-[16px] text-black">
          No specific time of the day.
        </Text>
      </Pressable>

      <Text className="mt-7 text-[21px] font-medium text-black">Hours</Text>

      <View className="mt-4 flex-row flex-wrap items-center gap-4">
        {hours.map((hour, index) => (
          <StepperBox
            key={index}
            widthClassName="w-[116px]"
            disabled={noSpecificHour}
            value={formatHour(hour)}
            onIncrement={() => updateHour(index, incrementValue(hour, 23))}
            onDecrement={() => updateHour(index, decrementValue(hour, 23))}
          />
        ))}

        <Pressable
          onPress={addHour}
          disabled={noSpecificHour}
          className={`h-[46px] flex-row items-center justify-center rounded-[10px] border-[2px] border-[#0D5175] bg-white px-5 ${
            noSpecificHour ? "opacity-50" : ""
          }`}
        >
          <Plus size={20} color="#0D5175" />

          <Text className="ml-2 text-[16px] font-medium text-[#0D5175]">
            Add another hour
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => setNoSpecificHour((current) => !current)}
        className="mt-7 flex-row items-center"
      >
        <View
          className={`h-[22px] w-[22px] rounded-[4px] border-[2px] border-black ${
            noSpecificHour ? "bg-[#0D5175]" : "bg-transparent"
          }`}
        />

        <Text className="ml-3 text-[16px] text-black">
          No specific hour specified.
        </Text>
      </Pressable>

      <Text className="mt-8 text-[21px] font-medium text-black">
        Other instructions
      </Text>

      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          value={instruction}
          onChangeText={(value) => updateInstruction(index, value)}
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

        <Text className="ml-2 text-[17px] font-medium text-[#0D5175]">
          Add Instruction
        </Text>
      </Pressable>

      <Pressable
        disabled={saving}
        onPress={handleSubmit}
        className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${
          saving ? "opacity-60" : ""
        }`}
      >
        <Text className="text-[17px] font-semibold text-white">
          {saving
            ? "Saving..."
            : medication
              ? "Confirm update"
              : "Confirm creation"}
        </Text>
      </Pressable>
    </View>
  );
}

type StepperBoxProps = {
  value: string;
  disabled?: boolean;
  widthClassName?: string;
  onIncrement: () => void;
  onDecrement: () => void;
};

function StepperBox({
  value,
  disabled = false,
  widthClassName = "flex-1",
  onIncrement,
  onDecrement,
}: StepperBoxProps) {
  return (
    <View
      className={`h-[40px] ${widthClassName} flex-row items-center justify-center rounded-[10px] border-[2px] border-[#97A5A8] bg-white ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <Text className="text-[14px] text-black">{value}</Text>

      <View className="ml-2">
        <Pressable disabled={disabled} onPress={onIncrement} hitSlop={8}>
          <MaterialIcons name="keyboard-arrow-up" size={16} color="#000" />
        </Pressable>

        <Pressable disabled={disabled} onPress={onDecrement} hitSlop={8}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color="#000"
            style={{ marginTop: -8 }}
          />
        </Pressable>
      </View>
    </View>
  );
}