import { Colors, Sizes } from "@/constants/theme";
import { CalendarCheck2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type BookingSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar: () => void;
  onGoHome: () => void;
};

export default function BookingSuccessOverlay({
  visible,
  onAddToCalendar,
  onGoHome,
}: BookingSuccessOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
        <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />

        <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.h1 + Sizes.h3 }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ marginBottom: Sizes.h4, height: Sizes.boxS + Sizes.p2, width: Sizes.boxS + Sizes.p2, alignItems: "center", justifyContent: "center" }}>
              <CalendarCheck2 size={Sizes.boxS + 10} color={Colors.secondary} strokeWidth={2} />
            </View>

            <Text style={{ marginBottom: Sizes.h4, textAlign: "center", fontSize: Sizes.h4 + 1, fontWeight: "500", lineHeight: 28, color: Colors.text }}>
              {t(`success-booking.title`)}
            </Text>

            <View style={{ marginBottom: Sizes.h4, width: "100%", paddingHorizontal: Sizes.p3 }}>
              <Text style={{ marginBottom: Sizes.p3, textAlign: "left", fontSize: Sizes.paragraph, lineHeight: 24, color: Colors.text }}>
                {t(`success-booking.info`)}
              </Text>

              <Text style={{ textAlign: "left", fontSize: Sizes.paragraph, lineHeight: 24, color: Colors.text }}>
                {t(`success-booking.info2`)}
              </Text>
            </View>

            <Pressable
              onPress={onAddToCalendar}
              style={{ marginBottom: Sizes.h5, height: Sizes.BtnP, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.bg2 }}>
              <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.secondary }}>
                {t(`success-booking.add`)}
              </Text>
            </Pressable>

            <Pressable
              onPress={onGoHome}
              style={{ height: Sizes.BtnP, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
              <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
                {t(`success-booking.home`)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
