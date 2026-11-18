import { Colors, Sizes } from "@/constants/theme";
import { deleteMyAccount } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type DeleteModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({ visible, onCancel, onConfirm }: DeleteModalProps) {

  const { t } = useTranslation();


  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(184,200,232,0.8)", paddingHorizontal: Sizes.h2 }}>

        <View style={{ width: "100%", borderRadius: Sizes.p3, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.h4, paddingVertical: Sizes.h1 + Sizes.h3 }}>
          <Text style={{ textAlign: "center", fontSize: Sizes.h3, fontWeight: "600", color: Colors.text }}>
            {t(`delete-modal.query`)}
          </Text>

          <Text style={{ marginTop: Sizes.h5, textAlign: "center", fontSize: Sizes.paragraph, color: Colors.text }}>
            {t(`delete-modal.notice`)}
          </Text>

          <Pressable
            onPress={onCancel}
            style={{ marginTop: Sizes.h1, marginBottom: Sizes.p2, height: Sizes.BtnP, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3, backgroundColor: Colors.bg2 }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.secondary }}>
              {t(`delete-modal.stay`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              try {
                await deleteMyAccount();
                onConfirm();
                router.replace("/login");
              } catch (err) {
                console.error("[DeleteModal] delete failed:", err);
              }
            }}
            style={{ marginTop: Sizes.h5, height: Sizes.BtnP, alignItems: "center", justifyContent: "center", borderRadius: Sizes.p3 + Sizes.p1, backgroundColor: Colors.delete }}
          >
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
              {t(`delete-modal.leave`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}