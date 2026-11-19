import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type UpdateAppointmentSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar?: () => void;
  onGoHome: () => void;
};

export default function UpdateAppointmentSuccessOverlay({
  visible,
  onAddToCalendar,
  onGoHome,
}: UpdateAppointmentSuccessOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            borderRadius: Sizes.h4,
            backgroundColor: Colors.bg1,
            width: "90%",
            paddingHorizontal: Sizes.h4,
            paddingBottom: Sizes.h2,
            paddingTop: Sizes.h3,
          }}
        >
          <View style={{ marginBottom: Sizes.p0, alignItems: "center" }}>
            <MaterialIcons name="event-available" size={104} color={Colors.primary} />
          </View>

          <Text style={{
            marginBottom: Sizes.h4,
            textAlign: "center",
            fontSize: Sizes.h4,
            fontWeight: "500",
            lineHeight: Sizes.h4,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.title`)}
          </Text>

          <Text style={{
            marginBottom: Sizes.h4,
            textAlign: "left",
            fontSize: Sizes.paragraph,
            lineHeight: Sizes.h4,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.info`)}
          </Text>

          <Text style={{
            marginBottom: Sizes.h3,
            textAlign: "left",
            fontSize: Sizes.paragraph,
            lineHeight: Sizes.h4,
            color: Colors.text
          }}>
            {t(`updated-booking-overlay.info2`)}
          </Text>

          <Pressable
            onPress={onAddToCalendar}
            style={{
              marginBottom: Sizes.h5,
              height: Buttons.height,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: Sizes.p3,
              backgroundColor: Colors.bg2
            }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.secondary }}>
              {t(`updated-booking-overlay.add`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onGoHome}
            style={{
              height: Buttons.height,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: Sizes.p3,
              backgroundColor: Colors.primary
            }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
              {t(`updated-booking-overlay.view`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}