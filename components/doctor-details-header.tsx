import { useDoctor } from "@/src/hooks/useDoctor";
import { useIsFavourite } from "@/src/hooks/useIsFavourite";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DoctorHeaderProps = {
    name: string;
    profession: string;
    doctorId?: string;
};

function StarButton({ doctorId }: { doctorId: string }) {
    const { isFavourite, setIsFavourite } = useIsFavourite(doctorId);
    const { toggle } = useToggleFavourite();

    return (
        <TouchableOpacity
            onPress={async () => {
                const result = await toggle(doctorId);
                setIsFavourite(result);
            }}
        >
            <MaterialIcons
                name={isFavourite ? "star" : "star-border"}
                size={28}
                color="#E7BF3C"
            />
        </TouchableOpacity>
    );
}

export default function DoctorHeader({ name, profession, doctorId }: DoctorHeaderProps) {
    const { doctor } = useDoctor(doctorId);
    const avatar = doctor?.avatar_url || null;

    const { t } = useTranslation();

    return (
        <View className="bg-white border-b border-[#09516D]">
            <View className="items-center justify-between px-3 pt-8 pb-4">
                <View className="items-center">
                    {avatar ? (
                        <Image source={{ uri: avatar }} className="h-14 w-14 rounded-full" />
                    ) : (
                        <View className="h-14 w-14 rounded-full bg-[#D7E8ED]" />
                    )}
                    <View style={styles.favorite}>
                        <Text className="ml-7 mr-7 text-2xl font-regular text-black">
                            {name}
                        </Text>
                        {doctorId ? <StarButton doctorId={String(doctorId)} /> : null}
                    </View>
                    <Text className="ml-7 mr-7 text-xl font-medium text-black">
                        {t(`doctor-details-header.${profession}`)}
                    </Text>
                </View>
                <View style={styles.iconsHeader} className="justify-between mt-6 px-4 mb-2 items-center">
                    <View style={styles.newPatient}>
                        <TouchableOpacity>
                            <MaterialIcons name="person-add" size={44} color="#0D5175" className="pr-2" />
                        </TouchableOpacity>
                        <Text>{t(`doctor-details-header.accepts`)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginStart: 30 }}>
                        <View style={{ width: 1, height: 40, backgroundColor: '#000404' }} />
                    </View>
                    <View style={styles.videoCall}>
                        <TouchableOpacity>
                            <MaterialIcons name="video-camera-front" size={44} color="#0D5175" className="pr-2" />
                        </TouchableOpacity>
                        <Text>{t(`doctor-details-header.videocalls`)}</Text>
                    </View>

                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    favorite: {
        marginLeft: '6%',
        flexDirection: 'row',
    },
    iconsHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    newPatient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        width: '30%',
    },
    videoCall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4
    },
})