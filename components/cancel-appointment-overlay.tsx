import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type CancelAppointmentOverlayProps = {
  visible: boolean;
  cancelling?: boolean;
  onClose?: () => void;
  onPostpone: () => void;
  onCancelAppointment: () => void;
};

export default function CancelAppointmentOverlay({
  visible,
  cancelling = false,
  onClose,
  onPostpone,
  onCancelAppointment,
}: CancelAppointmentOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
        <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} onPress={onClose} />

        <View style={{ width: "100%", borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingBottom: Sizes.h2, paddingTop: Sizes.h5 }}>
          <Pressable
            onPress={onClose}
            disabled={cancelling}
            style={{ marginBottom: Sizes.p2, height: Sizes.IconLg - 2, width: Sizes.IconLg - 2, alignSelf: "flex-end", alignItems: "center", justifyContent: "center" }}
          >
            <X size={28} color={Colors.text} strokeWidth={2} />
          </Pressable>

          <MaterialIcons name="edit-calendar" size={90} color={Colors.secondary} style={{ alignSelf: "center" }} />
          <Text style={{ marginHorizontal: Sizes.h4, marginTop: Sizes.h4, marginBottom: Sizes.h1 + Sizes.h3, textAlign: "center", justifyContent: "center", fontSize: Sizes.h4, fontWeight: "500", lineHeight: 28, color: Colors.text }}>
            {t(`cancel-appointment-overlay.query`)}
          </Text>

          <Pressable
            onPress={onCancelAppointment}
            disabled={cancelling}
            style={{ marginBottom: Sizes.h5, height: Buttons.height, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.bg2, opacity: cancelling ? 0.6 : 1 }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.secondary }}>
              {cancelling ? t(`cancel-appointment-overlay.cancelling`) : t(`cancel-appointment-overlay.cancel`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onPostpone}
            disabled={cancelling}
            style={{ height: Buttons.height, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
              {t(`cancel-appointment-overlay.post`)}
            </Text>
          </Pressable>


        </View>
      </View>
    </Modal>
  );
}