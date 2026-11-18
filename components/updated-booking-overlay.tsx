import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type UpdateAppointmentSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar?: () => void;
  onViewAppointments: () => void;
};

export default function UpdateAppointmentSuccessOverlay({
  visible,
  onAddToCalendar,
  onViewAppointments,
}: UpdateAppointmentSuccessOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            borderRadius: Sizes.h4,
            backgroundColor: Colors.bg1,
            width: "92%",
            paddingHorizontal: Sizes.h4,
            paddingBottom: Sizes.h2,
            paddingTop: Sizes.h1 + Sizes.h3,
          }}
        >
          <View style={{ marginBottom: Sizes.h4, alignItems: "center" }}>
            <MaterialIcons name="event-available" size={104} color={Colors.primary} />
          </View>

          <Text style={{
            marginBottom: Sizes.IconLg,
            textAlign: "center",
            fontSize: Sizes.h2,
            fontWeight: "500",
            lineHeight: Sizes.IconNml,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.title`)}
          </Text>

          <Text style={{
            marginBottom: Sizes.h1 + Sizes.h2,
            textAlign: "left",
            fontSize: Sizes.h3,
            lineHeight: Sizes.h1,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.info`)}
          </Text>

          <Text style={{
            marginBottom: Sizes.h4,
            textAlign: "left",
            fontSize: Sizes.h3 + 1,
            lineHeight: Sizes.h1,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.info2`)}
          </Text>

          <Pressable
            onPress={onAddToCalendar}
            style={{
              marginBottom: Sizes.h1,
              height: Sizes.boxS,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: Sizes.p3,
              borderWidth: Buttons.w2,
              borderColor: Colors.secondary,
              backgroundColor: Colors.bg2
            }}
          >
            <Text style={{ fontSize: Sizes.h3, fontWeight: "600", color: Colors.secondary }}>
              {t(`updated-booking-overlay.add`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onViewAppointments}
            style={{
              height: Sizes.boxS,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: Sizes.p3,
              backgroundColor: Colors.primary
            }}
          >
            <Text style={{ fontSize: Sizes.h3, fontWeight: "600", color: Colors.bg2 }}>
              {t(`updated-booking-overlay.view`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}