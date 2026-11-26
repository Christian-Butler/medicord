import { Colors, Sizes } from "@/constants/theme";
import { BriefcaseMedicalIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type prescriptionProps = {
    visible: boolean;
    onConfirm: () => void;
};

export default function Prescription({
    visible,
    onConfirm,
}: prescriptionProps) {

    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
                <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />

                <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.h1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ marginBottom: Sizes.h2, height: Sizes.boxS, width: Sizes.imgNm + Sizes.p2, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}>
                            <BriefcaseMedicalIcon size={Sizes.IconLg} color={Colors.bg2} strokeWidth={2} />
                        </View>

                        <Text style={{ marginBottom: Sizes.h1, textAlign: "center", fontSize: Sizes.h4, fontWeight: "600", lineHeight: 28, color: Colors.text }}>
                            {t(`first-patient-overlay.info`)}
                        </Text>

                        <Pressable
                            onPress={onConfirm}
                            style={{ height: Sizes.BtnP, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}>
                            <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                                {t(`prescription-overlay.confirm`)}
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </View>
        </Modal>
    );
}
