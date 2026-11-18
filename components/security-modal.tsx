import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type SecurityConfirmationModalProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function SecurityConfirmationModal({ visible, message, onClose }: SecurityConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: Sizes.h2
      }}>
        <View style={{
          width: "100%",
          borderRadius: Sizes.h4,
          backgroundColor: Colors.bg2,
          paddingHorizontal: Sizes.h2,
          paddingVertical: Sizes.h1 + Sizes.h3
        }}>
          <Pressable onPress={onClose}
            style={{
              position: "absolute",
              right: Sizes.h4,
              top: Sizes.h4,
              padding: Sizes.p2
            }}>
            <MaterialIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>

          <Text style={{ textAlign: "center", fontSize: Sizes.h5, fontWeight: "500", lineHeight: Sizes.h2, color: Colors.text }}>
            {message}
          </Text>

          <Pressable
            onPress={onClose}
            style={{
              marginTop: Sizes.h1,
              height: Buttons.height,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: Sizes.p3,
              backgroundColor: Colors.primary
            }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "600", color: Colors.bg2 }}>{t(`security-modal.understand`)}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}