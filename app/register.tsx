import { useRegister } from "@/src/hooks/useRegister";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { toLocalIsoDate } from "@/src/utils/dateTime";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterPage() {
  const {
    fullName, setFullName,
    dateOfBirth, setDateOfBirth,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    avatarUri,
    loading,
    error,
    handlePickAvatar,
    handleRegister,
  } = useRegister();

  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [year, month, day] = dateOfBirth ? dateOfBirth.split("-") : [];
  const displayDate = dateOfBirth ? `${day}/${month}/${year}` : "";

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) setDateOfBirth(toLocalIsoDate(selectedDate.toISOString()));
    if (Platform.OS !== "ios") setShowPicker(false);
  };


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#EEF9FB]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-center text-[28px] font-semibold text-[#075B7A]">
          {t(`register.name`)}
        </Text>

        <Text className="mt-3 text-center text-[20px] font-medium text-black">
          {t(`register.create`)}
        </Text>

        {/* Avatar picker */}
        <Pressable onPress={handlePickAvatar} className="mt-8 items-center">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="h-[90px] w-[90px] rounded-full"
            />
          ) : (
            <View className="h-[90px] w-[90px] items-center justify-center rounded-full border-[2px] border-dashed border-[#9BA8AB] bg-white">
              <MaterialIcons name="add-a-photo" size={28} color="#7A8A8D" />
            </View>
          )}
          <Text className="mt-2 text-[14px] text-[#075B7A]">
            {avatarUri ? t(`register.change`) : t(`register.add`)}
          </Text>
        </Pressable>

        {error ? (
          <Text className="mt-6 text-center text-[16px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

        <Text className="mt-8 text-[16px] font-medium text-black">{t("register.fullNameLabel")}</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder={t(`register.fullName`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[16px] font-medium text-black">{t(`register.birth`)}</Text>
       <Pressable
          onPress={() => setShowPicker((open) => !open)}
          className="mt-2 h-[50px] justify-center rounded-[14px] border border-[#0D5175] bg-white px-4"
        >
          <Text className={`text-[16px] ${displayDate ? "text-black" : "text-[#7A8A8D]"}`}>
            {displayDate || t(`register.bDate`)}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={dateOfBirth ? new Date(`${dateOfBirth}T00:00:00`) : new Date(2000, 0, 1)}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
          />
        )}

        <Text className="mt-5 text-[16px] font-medium text-black">{t(`register.phone`)}</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder={t(`register.number`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[16px] font-medium text-black">{t(`register.email`)}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={t(`register.eAddress`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[16px] font-medium text-black">{t(`register.password`)}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t(`register.createP`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />
        <Text className="mt-5 text-[16px] font-medium text-black">{t(`register.confirmPassword`)}</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder={t(`register.repeatP`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Pressable
          disabled={loading}
          onPress={handleRegister}
          className={`mt-8 h-[50px] items-center justify-center rounded-[13px] bg-[#5085A8] ${loading ? "opacity-60" : ""
            }`}
        >
          <Text className="text-[16px] font-medium text-white">
            {loading ? t(`register.creating`) : t(`register.confirm`)}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/login")}
          className="mt-6 items-center"
        >
          <Text className="text-[16px] text-[#075B7A]">
            {t(`register.login`)}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}