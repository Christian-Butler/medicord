import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DoctorHeaderProps = {
    name: string;
    profession: string;
};

export default function DoctorHeader({ name, profession }: DoctorHeaderProps) {
    return (
        <View className="bg-white">
            <View className="items-center justify-between px-3 pt-8 pb-4">
                <View className="items-center">
                    <Image
                        source={{
                            uri: 'https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg',
                        }}
                        className="h-14 w-14 rounded-full"
                    />
                    <View style={styles.favorite}>
                        <Text className="ml-7 mr-7 text-2xl font-regular text-black">
                            {name}
                        </Text>
                        <TouchableOpacity >
                            <MaterialIcons name="star-border" size={24} color="#3f3128" />
                        </TouchableOpacity>
                    </View>
                    <Text className="ml-7 mr-7 text-xl font-medium text-black">
                        {profession}
                    </Text>
                </View>
                <View style={styles.iconsHeader}>
                    <View style={styles.newPatient}>
                        <TouchableOpacity style={{ padding: 8 }}>
                            <MaterialIcons name="person-add" size={44} color="#0D5175" />
                        </TouchableOpacity>
                        <Text>Accepts new patients</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginStart: 30 }}>
                        <View style={{ width: 16 }} />
                        <View style={{ width: 1, height: 40, backgroundColor: '#000404' }} />
                        <View style={{ width: 16 }} />
                    </View>
                    <View style={styles.videoCall}>
                        <TouchableOpacity style={{ padding: 8 }}>
                            <MaterialIcons name="video-camera-front" size={44} color="#0D5175" />
                        </TouchableOpacity>
                        <Text>No videocalls</Text>
                    </View>

                </View>
            </View>
            <View className="h-1 bg-[#09516D]" />
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
        width: '30%',
    },
    videoCall: {
        flexDirection: 'row',
        alignItems: 'center',

    },
})