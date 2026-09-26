import ScreenHeader from "@/components/screen-header";
import SecurityModal from "@/components/security-modal";
import { useResetPassword } from "@/src/hooks/useResetPassword";
import { useUpdateEmail } from "@/src/hooks/useUpdateEmail";
import { useUpdatePhone } from "@/src/hooks/useUpdatePhone";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityDetails() {

  const { t } = useTranslation();

  const { phone, setPhone, loading: phoneLoading, error: phoneError, showConfirmation: showPhoneModal, setShowConfirmation: setShowPhoneModal, handleUpdatePhone } = useUpdatePhone();
  const { email, setEmail, loading: emailLoading, error: emailError, showConfirmation: showEmailModal, setShowConfirmation: setShowEmailModal, handleUpdateEmail } = useUpdateEmail();
  const { password, setPassword, confirm, setConfirm, loading: passwordLoading, error: passwordError, handleReset } = useResetPassword();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifyByEmail, setVerifyByEmail] = useState(false);
  const [verifyByMessage, setVerifyByMessage] = useState(false);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#EEF9FB]">
      <ScreenHeader title="Security details" />

      <SecurityModal
        visible={showPhoneModal}
        message={`We've sent a verification link\nto your new phone number,\nplease check it to confirm\nthe change !`}
        onClose={() => setShowPhoneModal(false)}
      />

      <SecurityModal
        visible={showEmailModal}
        message={`We've sent a verification link\nto your new email address,\nplease check it to confirm\nthe change !`}
        onClose={() => setShowEmailModal(false)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Phone number */}
        <View className="mx-6 mt-8">
          <Text className="text-[18px] font-medium text-black">Phone number</Text>
          <Text className="mt-4 text-[14px]text-black">Change phone number</Text>
          {phoneError ? <Text className="mt-2 text-[14px] text-[#B42318]">{phoneError}</Text> : null}
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="0851234567"
            placeholderTextColor="#7A8A8D"
            keyboardType="phone-pad"
            className="mt-3 h-[52px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
          />
          <Pressable
            onPress={handleUpdatePhone}
            disabled={phoneLoading}
            className={`mt-3 h-[52px] items-center justify-center rounded-[14px] bg-[#5085A8] ${phoneLoading ? "opacity-60" : ""}`}
          >
            <Text className="text-[16px] font-semibold text-white">
              {phoneLoading ? "Updating..." : "Confirm"}
            </Text>
          </Pressable>
        </View>

        {/* Email address */}
        <View className="mx-6 mt-8">
          <Text className="text-[18px] font-medium text-black">Email address</Text>
          <Text className="mt-4 text-[14px]text-black">Change email address</Text>
          {emailError ? <Text className="mt-2 text-[14px] text-[#B42318]">{emailError}</Text> : null}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="demo@medicord.test"
            placeholderTextColor="#7A8A8D"
            autoCapitalize="none"
            keyboardType="email-address"
            className="mt-3 h-[52px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
          />
          <Pressable
            onPress={handleUpdateEmail}
            disabled={emailLoading}
            className={`mt-3 h-[52px] items-center justify-center rounded-[14px] bg-[#5085A8] ${emailLoading ? "opacity-60" : ""}`}
          >
            <Text className="text-[16px] font-semibold text-white">
              {emailLoading ? "Updating..." : "Confirm"}
            </Text>
          </Pressable>
        </View>

        {/* Password */}
        <View className="mx-6 mt-8">
          <Text className="text-[18px] font-medium text-black">Security details</Text>
          {passwordError ? <Text className="mt-2 text-[14px] text-[#B42318]">{passwordError}</Text> : null}

          <Text className="mt-4 text-[14px] text-black">Current password</Text>
          <View className="mt-2 flex-row items-center rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4">
            <TextInput
              secureTextEntry={!showCurrentPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#7A8A8D"
              className="h-[52px] flex-1 text-[16px] text-black"
            />
            <Pressable onPress={() => setShowCurrentPassword((p) => !p)}>
              <MaterialIcons name={showCurrentPassword ? "visibility" : "visibility-off"} size={22} color="#7A8A8D" />
            </Pressable>
          </View>

          <Text className="mt-4 text-[14px] text-black">New password</Text>
          <View className="mt-2 flex-row items-center rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showNewPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#7A8A8D"
              className="h-[52px] flex-1 text-[16px] text-black"
            />
            <Pressable onPress={() => setShowNewPassword((p) => !p)}>
              <MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} size={22} color="#7A8A8D" />
            </Pressable>
          </View>

          <Text className="mt-4 text-[14px] text-black">Confirm password</Text>
          <View className="mt-2 flex-row items-center rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4">
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirmPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#7A8A8D"
              className="h-[52px] flex-1 text-[16px] text-black"
            />
            <Pressable onPress={() => setShowConfirmPassword((p) => !p)}>
              <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color="#7A8A8D" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => setVerifyByEmail((p) => !p)}
            className="mt-4 flex-row items-center"
          >
            <View className={`h-[18px] w-[18px] rounded-full border-[2px] ${verifyByEmail ? "border-[#0D5175] bg-[#0D5175]" : "border-[#9BA8AB] bg-white"}`} />
            <Text className="ml-3 text-[15px] text-black">Request verification by email.</Text>
          </Pressable>

          <Pressable
            onPress={() => setVerifyByMessage((p) => !p)}
            className="mt-3 flex-row items-center"
          >
            <View className={`h-[18px] w-[18px] rounded-full border-[2px] ${verifyByMessage ? "border-[#0D5175] bg-[#0D5175]" : "border-[#9BA8AB] bg-white"}`} />
            <Text className="ml-3 text-[15px] text-black">Request verification by message.</Text>
          </Pressable>

          <Pressable
            onPress={handleReset}
            disabled={passwordLoading}
            className={`mt-6 h-[52px] items-center justify-center rounded-[14px] bg-[#5085A8] ${passwordLoading ? "opacity-60" : ""}`}
          >
            <Text className="text-[16px] font-semibold text-white">
              {passwordLoading ? "Updating..." : "Confirm"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}