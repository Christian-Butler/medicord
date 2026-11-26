import { Colors, Sizes } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type DeleteRoutineProps = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
};

export default function DeleteRoutine({ visible, onCancel, onConfirm }: DeleteRoutineProps) {

    const { t } = useTranslation();


    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(184,200,232,0.8)", paddingHorizontal: Sizes.h2 }}>

                <View style={{ width: "100%", borderRadius: Sizes.p3, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.h4, paddingVertical: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ textAlign: "center", fontSize: Sizes.h3, fontWeight: "600", color: Colors.text }}>
                        {t(`delete-routine.query`)}
                    </Text>

                    <Text style={{ marginTop: Sizes.h5, textAlign: "center", fontSize: Sizes.paragraph, color: Colors.text }}>
                        {t(`delete-routine.notice`)}
                    </Text>

                    <Pressable
                        onPress={onCancel}
                        style={{ marginTop: Sizes.h1, marginBottom: Sizes.p2, height: Sizes.BtnP, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.bg2 }}
                    >
                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.secondary }}>
                            {t(`delete-routine.stay`)}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onConfirm}
                        style={{ marginTop: Sizes.h5, height: Sizes.BtnP, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.primary }}
                    >
                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
                            {t(`delete-modal.confirm`)}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}