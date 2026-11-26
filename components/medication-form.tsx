import { Buttons, Colors, Sizes } from "@/constants/theme";
import { toLocalDay } from "@/src/libs/medicationCalender";
import type { Medication, MedicationFrequency, MedicationInput } from "@/src/types/medicationTypes";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [dateStart, setDateStart] = useState<Date>(() => toLocalDay(new Date()));
  const [dateEnd, setDateEnd] = useState<Date>(() => toLocalDay(new Date()));
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
  const { t } = useTranslation();

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
    const startDate = toLocalDay(medication.date_start ?? new Date());
    const endDate = toLocalDay(medication.date_end ?? new Date());
    setDateStart(startDate);
    setDateEnd(endDate < startDate ? startDate : endDate);
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
      const nextStartDate = toLocalDay(selectedDate);
      setDateStart(nextStartDate);
      setDateEnd((currentEndDate) =>
        currentEndDate < nextStartDate ? nextStartDate : currentEndDate
      );
    } else if (selectedDate && showPicker === "end") {
      const nextEndDate = toLocalDay(selectedDate);
      if (nextEndDate >= dateStart) {
        setDateEnd(nextEndDate);
      }
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
      setLocalError(t(`medication-form.nameMed`));
      return;
    }
    if (dateEnd < dateStart) {
      setLocalError(t("medication-form.endDateError"));
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

  const confirm = Boolean(
    name.trim() &&
    selectedDays.some((day) => weekDays.includes(day)) &&
    dateStart &&
    dateEnd &&
    dateEnd >= dateStart &&
    frequency
  );

  return (
    <View style={{ marginHorizontal: Sizes.h4, paddingBottom: Sizes.h1 + Sizes.h3, paddingTop: Sizes.h2 }}>

      {/* Name */}
      <Text style={{ marginRight: Sizes.h4, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t(`medication-form.title`)}</Text>

      <TextInput
        value={name}
        onChangeText={(v) => { setName(v); setLocalError(null); }}
        placeholder={t(`medication-form.placeholderName`)}
        placeholderTextColor={Colors.textMuted}
        style={{ marginTop: Sizes.p3, height: Buttons.height, borderRadius: Sizes.p3, borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.bg2, paddingHorizontal: Sizes.h4, fontSize: Sizes.paragraph, color: Colors.text }}
      />
      {visibleError ? (
        <Text style={{ marginTop: Sizes.p2, fontSize: Sizes.paragraph, color: Colors.error }}>{visibleError}</Text>
      ) : null}

      {/* Duration */}
      <Text style={{ marginTop: Sizes.h1 + Sizes.p1, marginBottom: Sizes.p3, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t("Duration")}</Text>
      <View style={{ paddingHorizontal: Sizes.h1 + Sizes.h3, gap: Sizes.p3, marginTop: Sizes.p3, alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setShowPicker((current) => current === "start" ? null : "start")}
          style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>
            {dateStart.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>{t(`medication-form.until`)}</Text>
        <TouchableOpacity
          onPress={() => setShowPicker((current) => current === "end" ? null : "end")}
          style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>
            {dateEnd.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
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
      <View style={{ alignItems: "center" }}>
        {showPicker === "end" && (
          <DateTimePicker
            value={dateEnd}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={dateStart}
            maximumDate={new Date(2050, 11, 31)}
          />
        )}
      </View>

      {/* Week */}
      <Text style={{ marginTop: Sizes.h1 + Sizes.p1, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t(`medication-form.weekly`)}</Text>
      <View style={{ marginTop: Sizes.p3, flexDirection: "row", flexWrap: "wrap", gap: Sizes.p2 }}>
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              style={{ height: 40, minWidth: 45, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, paddingHorizontal: Sizes.p2, backgroundColor: selected ? Colors.secondary : Colors.bg2 }}
            >
              <Text style={{ fontSize: Sizes.sm - 1, fontWeight: "500", color: selected ? Colors.bg2 : Colors.secondary }}>
                {t(`medication-container.${day}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>


      {/* Daily */}
      <View>
        <Text style={{ marginTop: Sizes.h1 + Sizes.p1, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t("medication-form.daily")}</Text>
        <View style={{ marginTop: Sizes.h5, flexDirection: "row", flexWrap: "wrap", gap: Sizes.h4 }}>
          {frequencyOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setFrequency(option.value)}
              style={{ height: 40, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, paddingHorizontal: Sizes.h4, backgroundColor: frequency === option.value ? Colors.secondary : Colors.bg2 }}
            >
              <Text style={{ fontSize: Sizes.sm, fontWeight: "500", color: frequency === option.value ? Colors.bg2 : Colors.secondary }}>
                {t(`medication-container.${option.value}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Intake Frequency */}
      <Text style={{ marginTop: Sizes.h5, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t("medication-form.timeWindow")}</Text>
      <View style={{ marginTop: Sizes.p3, flexDirection: "row", flexWrap: "wrap", gap: Sizes.h4 }}>
        {daily.map((time) => {
          const selected = selectedDays.includes(time);
          return (
            <Pressable
              key={time}
              onPress={() => !noSpecificTime && toggleDay(time)}
              disabled={noSpecificTime}
              style={{ paddingHorizontal: Sizes.h4, height: 40, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: selected ? Colors.secondary : Colors.bg2, opacity: noSpecificTime ? 0.5 : 1 }}
            >
              <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: selected ? Colors.bg2 : Colors.secondary }}>
                {t(`medication-container.${time}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Hours specify */}
      <View style={{ marginTop: Sizes.p3, flexDirection: "row", alignItems: "center", gap: Sizes.p2 }}>
        {showHourSelector && (
          <Pressable
            disabled={noSpecificTime}
            onPress={() => setShowHourDropdown((previous) => !previous)}
            style={{ marginTop: Sizes.h5, minWidth: 0, flex: 1, height: Sizes.BtnP - Sizes.p1, flexDirection: "row", alignItems: "center", borderRadius: Sizes.p3, borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.bg2, paddingHorizontal: Sizes.p3, opacity: noSpecificTime ? 0.5 : 1 }}
          >
            <Text numberOfLines={1} style={{ marginRight: Sizes.p2, flex: 1, fontSize: Sizes.sm, color: Colors.text }}>
              {hours.length > 0 ? hours.join(", ") : t("medication-form.selectHours")}
            </Text>
            <ChevronDown size={20} color={Colors.secondary} />
          </Pressable>
        )}

        <Pressable
          disabled={noSpecificTime}
          onPress={() => setShowHourSelector(true)}
          style={{ marginTop: Sizes.h5, height: Sizes.BtnP - Sizes.p1, width: 160, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary, paddingHorizontal: Sizes.h4, opacity: noSpecificTime ? 0.5 : 1 }}
        >
          <Plus size={18} color={Colors.bg2} />
          <Text style={{ marginLeft: Sizes.p1, fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>{t("medication-form.specifyHours")}</Text>
        </Pressable>

      </View>

      {/* Dropdown hours */}
      {showHourDropdown && !noSpecificTime && (
        <ScrollView
          nestedScrollEnabled
          style={{ marginTop: Sizes.p2, maxHeight: 240, borderRadius: Sizes.p3, borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.bg2 }}
        >
          {specifyHours.map((hour) => {
            const selected = hours.includes(hour);
            return (
              <Pressable
                key={hour}
                onPress={() => toggleHour(hour)}
                style={{ minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: Colors.light.background, paddingHorizontal: Sizes.h4, backgroundColor: selected ? Colors.bg1 : Colors.bg2 }}
              >
                <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>{hour}</Text>
                {selected ? <Check size={18} color={Colors.secondary} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* No specific time */}
      <View style={{ marginTop: Sizes.h2, flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => setNoSpecificTime((p) => !p)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ height: Sizes.h5, width: Sizes.h5, borderRadius: Sizes.p0, borderWidth: 1, borderColor: Colors.secondary, backgroundColor: noSpecificTime ? Colors.secondary : "transparent" }} />
          <Text style={{ marginLeft: Sizes.p2, fontSize: Sizes.sm, color: Colors.text }}>{t("medication-form.noTimeWindow")}</Text>
        </Pressable>

      </View>

      {/* Instructions */}
      <Text style={{ marginTop: Sizes.h1, fontSize: Sizes.h4, fontWeight: "500", color: Colors.text }}>{t("medication-form.instructionsTitle")}</Text>
      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          value={instruction}
          onChangeText={(v) => updateInstruction(index, v)}
          placeholder={t("medication-form.instructionPlaceholder")}
          placeholderTextColor={Colors.textMuted}
          style={{ marginTop: Sizes.p3, height: Buttons.height, borderRadius: Sizes.p3, borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.bg2, paddingHorizontal: Sizes.h4, fontSize: Sizes.paragraph, color: Colors.text }}
        />
      ))}

      <Pressable
        onPress={addInstruction}
        style={{ marginTop: Sizes.h5, height: Sizes.BtnP - Sizes.p1, flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "flex-end", borderRadius: Sizes.p3, backgroundColor: Colors.primary, paddingHorizontal: Sizes.h4 }}
      >
        <Plus size={20} color={Colors.bg2} />
        <Text style={{ marginLeft: Sizes.p2, fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>{t("medication-form.addInstruction")}</Text>
      </Pressable>

      <Pressable
        disabled={!confirm || saving}
        onPress={handleSubmit}
        style={{ marginTop: Sizes.h1 + Sizes.h3, marginBottom: Sizes.h1 + Sizes.h3, height: Buttons.height, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: confirm ? Colors.success : Colors.textMuted, opacity: saving ? 0.6 : 1 }}
      >
        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
          {saving ? t("medication-form.saving") : medication ? t("medication-form.update") : t("medication-form.confirm")}
        </Text>
      </Pressable>
    </View>
  );
}
