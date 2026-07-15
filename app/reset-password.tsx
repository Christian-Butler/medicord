import { useResetPassword } from "@/src/hooks/useResetPassword";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ResetPasswordPage() {
  const { password, setPassword, confirm, setConfirm, loading, error, handleReset } = useResetPassword();

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
          New password
        </Text>

        {error ? (
          <Text className="mt-6 text-center text-[15px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

        <Text className="mt-8 text-[17px] font-medium text-black">New password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter new password"
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Text className="mt-5 text-[17px] font-medium text-black">Confirm password</Text>
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="Confirm new password"
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Pressable
          disabled={loading}
          onPress={handleReset}
          className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${
            loading ? "opacity-60" : ""
          }`}
        >
          <Text className="text-[17px] font-semibold text-white">
            {loading ? "Updating..." : "Update password"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}