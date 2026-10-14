import { useLogin } from "@/src/hooks/useLogin";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, loading, error, handleLogin } = useLogin();

  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#EEF9FB]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-center text-[34px] font-semibold text-[#075B7A]">
          {t(`login.name`)}
        </Text>

        <Text className="mt-3 text-center text-[20px] font-medium text-black">
          {t(`login.login`)}
        </Text>

        {error ? (
          <Text className="mt-6 text-center text-[15px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

        <Text className="mt-8 text-[16px] font-medium text-black">{t(`login.email`)}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={t(`login.placeholderE`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[16px] font-medium text-black">{t(`login.password`)}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t(`login.placeholderP`)}
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[50px] rounded-[14px] border border-[#0D5175] bg-white px-4 text-[16px] text-black"
        />

        <Pressable
          disabled={loading}
          onPress={handleLogin}
          className={`mt-10 h-[50px] items-center justify-center rounded-[13px] bg-[#5085A8] ${loading ? "opacity-60" : ""
            }`}
        >
          <Text className="text-[16px] font-semibold text-white">
            {loading ? t(`login.logging`) : t(`login.confirm`)}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/forgot-password")}
          className="mt-10 items-center"
        >
          <Text className="text-[14px] text-[#075B7A]">{t(`login.forgot`)}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/register")}
          className="mt-6 items-center"
        >
          <Text className="text-[14px] text-[#075B7A]">
            {t(`login.register`)}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}