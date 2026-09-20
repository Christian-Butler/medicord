import { useRegister } from "@/src/hooks/useRegister";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
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
    avatarUri,
    loading,
    error,
    handlePickAvatar,
    handleRegister,
  } = useRegister();

  const { t } = useTranslation();


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
        <Text className="text-center text-[34px] font-semibold text-[#075B7A]">
          {t(`register.name`)}
        </Text>

        <Text className="mt-3 text-center text-[22px] font-medium text-black">
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
          <Text className="mt-6 text-center text-[15px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

        <Text className="mt-8 text-[17px] font-medium text-black">Full name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder={t(`register.fullName`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[17px] font-medium text-black">{t(`register.birth`)}</Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder={t(`register.bDate`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[17px] font-medium text-black">{t(`register.phone`)}</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder={t(`register.number`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[17px] font-medium text-black">{t(`register.email`)}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={t(`register.eAddress`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[17px] font-medium text-black">{t(`register.password`)}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t(`register.createP`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Pressable
          disabled={loading}
          onPress={handleRegister}
          className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${loading ? "opacity-60" : ""
            }`}
        >
          <Text className="text-[17px] font-semibold text-white">
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