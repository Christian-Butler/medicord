import { Colors, Sizes } from "@/constants/theme";
import { CalendarDays } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type AppointmentReasonOverlayProps = {
  visible: boolean;
  selectedReasons: string[];
  specialty: string;
  onToggleReason: (reason: string) => void;
  onConfirm: () => void;
  onClose?: () => void;
};

const specialtyReasons: Record<string, string[]> = {
  gp: [
    "Regular check-up",
    "Follow up from previous visit.",
    "Blood works",
    "Prescription or medication review",
    "Other reasons",
  ],
  ophthalmology: [
    "Vision changes or blurred vision",
    "Eye pain, redness or irritation",
    "Routine eye examination",
    "Other reasons",
  ],
  dentistry: [
    "Toothache or tooth sensitivity",
    "Gum pain or bleeding",
    "Dental cleaning or check-up",
    "Other reasons",
  ],
  cardiology: [
    "Chest pain or pressure",
    "Palpitations or irregular heartbeat",
    "Blood pressure concerns",
    "Other reasons",
  ],
  dermatology: [
    "Rash, itching or skin irritation",
    "Acne or other skin condition",
    "Changing mole or skin lesion",
    "Other reasons",
  ],
  paediatrics: [
    "Child illness or symptoms",
    "Child growth or development",
    "Child vaccination or routine check-up",
    "Other reasons",
  ],
  gynecology: [
    "Menstrual or pelvic concerns",
    "Pregnancy or fertility advice",
    "Routine gynaecological check-up",
    "Other reasons",
  ],
  orthopaedics: [
    "Joint or bone pain",
    "Muscle or sports injury",
    "Back or neck pain",
    "Other reasons",
  ],
  gastroenterology: [
    "Stomach or abdominal pain",
    "Digestive or bowel changes",
    "Heartburn or reflux",
    "Other reasons",
  ],
  psychiatry: [
    "Anxiety or stress",
    "Low mood or depression",
    "Mental health medication review",
    "Other reasons",
  ],
  neurology: [
    "Headaches or migraines",
    "Numbness, tingling or weakness",
    "Dizziness or balance concerns",
    "Other reasons",
  ],
  endocrinology: [
    "Diabetes or blood sugar concerns",
    "Thyroid concerns",
    "Hormone or metabolism concerns",
    "Other reasons",
  ],
};

function getSpecialtyReasons(specialty: string) {
  const normalizedSpecialty = specialty.trim().toLowerCase();
  const specialtyKey = {
    ophthalmology: "ophthalmology",
    dentistry: "dentistry",
    cardiology: "cardiology",
    dermatology: "dermatology",
    paediatrics: "paediatrics",
    pediatrics: "paediatrics",
    gynecology: "gynecology",
    gynaecology: "gynecology",
    gyneacology: "gynecology",
    orthopaedics: "orthopaedics",
    orthopedics: "orthopaedics",
    gastroenterology: "gastroenterology",
    psychiatry: "psychiatry",
    neurology: "neurology",
    endocrinology: "endocrinology",
    gp: "gp",
  }[normalizedSpecialty];

  return specialtyReasons[specialtyKey ?? ""] ?? [];
}

export default function AppointmentReasonOverlay({
  visible,
  selectedReasons,
  onToggleReason,
  specialty,
  onConfirm,
  onClose,
}: AppointmentReasonOverlayProps) {

  const { t } = useTranslation();
  const reasons = getSpecialtyReasons(specialty);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
        <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} onPress={onClose} />

        <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.IconNml }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ marginBottom: Sizes.h4, height: Sizes.boxS + Sizes.p1, width: Sizes.boxS + Sizes.p1, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: "transparent" }}>
              <CalendarDays size={68} color={Colors.secondary} strokeWidth={2} />
            </View>

            <Text style={{ marginBottom: Sizes.h2, textAlign: "center", fontSize: Sizes.h4, fontWeight: "600", lineHeight: 28, color: Colors.text }}>
              {t(`booking-reason.query`)}
            </Text>

            <View style={{ marginBottom: Sizes.h2, width: "100%", paddingHorizontal: Sizes.h4 }}>
              {reasons.map((reason) => {
                const selected = selectedReasons.includes(reason);

                return (
                  <Pressable
                    key={reason}
                    onPress={() => onToggleReason(reason)}
                    style={{ marginBottom: Sizes.h5, flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{ marginRight: Sizes.h2, height: Sizes.h5 + 2, width: Sizes.h5 + 2, borderRadius: Sizes.p0, borderWidth: 1, borderColor: selected ? Colors.secondary : Colors.text, backgroundColor: selected ? Colors.secondary : "transparent" }}
                    />

                    <Text style={{ flex: 1, fontSize: Sizes.sm, color: Colors.text }}>
                      {t(`booking-reason.${reason}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={onConfirm}
              style={{ height: Sizes.BtnP - Sizes.p1, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
              <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                {t(`booking-reason.confirm`)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
