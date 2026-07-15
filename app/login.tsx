import { signInWithEmail } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await signInWithEmail(email, password);

      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setLoading(false);
    }
  }

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
          Log in
        </Text>

        {error ? (
          <Text className="mt-6 text-center text-[15px] text-[#B42318]">
            {error}
          </Text>
        ) : null}

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

        <Text className="mt-5 text-[17px] font-medium text-black">
          Password
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#7A8A8D"
          className="mt-2 h-[56px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
        />

        <Pressable
          disabled={loading}
          onPress={handleLogin}
          className={`mt-8 h-[58px] items-center justify-center rounded-[13px] bg-[#5085A8] ${
            loading ? "opacity-60" : ""
          }`}
        >
          <Text className="text-[17px] font-semibold text-white">
            {loading ? "Logging in..." : "Log in"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/register")}
          className="mt-6 items-center"
        >
          <Text className="text-[16px] text-[#075B7A]">
            Don&apos;t have an account? Register
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}