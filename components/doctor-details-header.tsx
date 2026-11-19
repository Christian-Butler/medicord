import { Colors, Inputs, Sizes } from "@/constants/theme";
import { useDoctor } from "@/src/hooks/useDoctor";
import { useIsFavourite } from "@/src/hooks/useIsFavourite";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
                name={isFavourite ? "bookmark" : "bookmark-border"}
                size={Sizes.h1}
                color={Colors.info}
            />
        </TouchableOpacity>
    );
}

export default function DoctorHeader({ name, profession, doctorId }: DoctorHeaderProps) {
    const { doctor } = useDoctor(doctorId);
    const avatar = doctor?.avatar_url || null;

    const { t } = useTranslation();

    return (
        <View
            style={{
                backgroundColor: Colors.bg2,
                borderBottomWidth: Inputs.w0,
                borderColor: Colors.secondary
            }}>
            <View
                className=" flex-row justify-end">
                <View
                    style={{
                        paddingHorizontal: Sizes.h2,
                        paddingVertical: Sizes.paragraph
                    }}
                    className="items-center">
                    {avatar ? (
                        <Image
                            source={{ uri: avatar }}
                            style={{
                                height: Sizes.imgNm,
                                width: Sizes.imgNm,
                                borderRadius: Sizes.boxS
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                height: Sizes.imgNm,
                                width: Sizes.imgNm,
                                borderRadius: Sizes.boxS,
                                backgroundColor: Colors.bg1
                            }} />
                    )}
                    <View style={styles.favorite}>
                        <Text
                            style={{
                                marginTop: Sizes.p0,
                                textAlign: "center",
                                fontSize: Sizes.h3,
                                color: Colors.text
                            }}>
                            {name}
                        </Text>

                    </View>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: Sizes.h5,
                            fontWeight: "400",
                            color: Colors.text
                        }}>
                        {t(`doctor-details-header.${profession}`)}
                    </Text>
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        paddingHorizontal: Sizes.h2
                    }}>
                    <View
                        style={{
                            paddingTop: Sizes.IconXL
                        }} />
                    {doctorId ?
                        <StarButton doctorId={String(doctorId)}
                        /> : null}
                </View>
                {/*  <View className="justify-between mt-6 px-4 mb-2 items-center">
                    <View style={styles.newPatient}>
                        <TouchableOpacity>
                            <MaterialIcons name="person-add" size={Sizes.IconLg} color={Colors.secondary} className="pr-2" />
                        </TouchableOpacity>
                        <Text>{t(`doctor-details-header.accepts`)}</Text>
                    </View>
                </View>
                */}
            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    favorite: {
        alignContent: "center",
    },
    newPatient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        width: '30%',
    },
})