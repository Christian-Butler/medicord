import { useForgotPassword } from "@/src/hooks/useForgotPassword";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ForgotPasswordPage() {
  const { email, setEmail, loading, error, sent, handleSend } = useForgotPassword();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#EEF9FB]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-center text-[34px] font-semibold text-[#075B7A]">
          Medicord
        </Text>

        <Text className="mt-3 text-center text-[22px] font-medium text-black">
          Reset password
        </Text>

        <Text className="mt-3 text-center text-[15px] font-normal text-[#555]">
          Enter your email and we will send you a reset link.
        </Text>

        {error ? (
          <Text className="mt-6 text-center text-[15px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

        {sent ? (
          <View className="mt-6 rounded-[14px] bg-[#DDF8FF] px-4 py-4">
            <Text className="text-center text-[15px] text-[#075B7A]">
              Reset link sent — check your email.
            </Text>
          </View>
        ) : null}

        {!sent ? (
          <>
            <Text className="mt-8 text-[17px] font-medium text-black">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#7A8A8D"
              className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
            />

            <Pressable
              disabled={loading}
              onPress={handleSend}
              className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${
                loading ? "opacity-60" : ""
              }`}
            >
              <Text className="text-[17px] font-semibold text-white">
                {loading ? "Sending..." : "Send reset link"}
              </Text>
            </Pressable>
          </>
        ) : null}

        <Pressable
          onPress={() => router.push("/login")}
          className="mt-6 items-center"
        >
          <Text className="text-[16px] text-[#075B7A]">Back to log in</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}