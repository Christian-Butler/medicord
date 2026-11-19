import { Colors, Sizes } from "@/constants/theme";
import { BriefcaseMedical } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type FirstTimeBookingOverlayProps = {
  visible: boolean;
  onNewPatient: () => void;
  onReturningPatient: () => void;
};

export default function FirstTimeBookingOverlay({
  visible,
  onNewPatient,
  onReturningPatient,
}: FirstTimeBookingOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
        <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />

        <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.h1 }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ marginBottom: Sizes.h2, height: Sizes.boxS, width: Sizes.imgNm + Sizes.p2, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}>
              <BriefcaseMedical size={48} color={Colors.bg2} strokeWidth={2} />
            </View>

            <Text style={{ marginBottom: Sizes.h1, textAlign: "center", fontSize: Sizes.h4, fontWeight: "600", lineHeight: 28, color: Colors.text }}>
              {t(`first-patient-overlay.query`)}
            </Text>

            <Pressable
              onPress={onNewPatient}
              style={{ marginBottom: Sizes.h4, height: Sizes.BtnP, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.bg2 }}>
              <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.secondary }}>
                {t(`first-patient-overlay.yes`)}
              </Text>
            </Pressable>

            <Pressable
              onPress={onReturningPatient}
              style={{ height: Sizes.BtnP, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}>
              <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                {t(`first-patient-overlay.no`)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
