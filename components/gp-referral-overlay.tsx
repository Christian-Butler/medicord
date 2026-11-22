import { Buttons, Colors, Sizes } from "@/constants/theme";
import { FileText, UserRound } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type GPOverlayProps = {
  visible: boolean;
  onGoToGp: () => void;
  onContinue: () => void;
};

export default function GPOverlay({
  visible,
  onGoToGp,
  onContinue,
}: GPOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
        <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />

        <View style={{ width: "100%", maxWidth: 350, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.paragraph, paddingVertical: Sizes.IconLg }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "relative", marginBottom: Sizes.h1 }}>
              <View style={{ height: Sizes.boxS, width: Sizes.boxS, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
                <FileText size={46} color={Colors.bg2} strokeWidth={2} />
              </View>

              <View style={{ position: "absolute", bottom: -Sizes.p2, right: -Sizes.p3, height: Sizes.h2 + Sizes.p3, width: Sizes.h2 + Sizes.p3, alignItems: "center", justifyContent: "center", borderRadius: Sizes.IconLg, backgroundColor: Colors.primary }}>
                <UserRound size={30} color={Colors.bg2} strokeWidth={2.5} />
              </View>
            </View>

            <Text style={{ marginBottom: Sizes.h1, textAlign: "center", fontSize: Sizes.h3, fontWeight: "600", color: Colors.text }}>
              {t(`gp-referral-overlay.read`)}
            </Text>

            <Text style={{ paddingHorizontal: Sizes.p3, marginBottom: Sizes.h1, textAlign: "center", fontSize: Sizes.paragraph, lineHeight: 24, color: Colors.text }}>
              {t(`booking-reason.requires`)}
            </Text>

            <Pressable
              onPress={onGoToGp}
              style={{ marginBottom: Sizes.h4, height: Buttons.height, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.bg2 }}>
              <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.secondary }}>
                {t(`gp-referral-overlay.takeTo`)}
              </Text>
            </Pressable>

            <Pressable
              onPress={onContinue}
              style={{ height: Buttons.height, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
              <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                {t(`gp-referral-overlay.continue`)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
