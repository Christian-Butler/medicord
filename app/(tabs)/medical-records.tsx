import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface MedicalList {
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    button: keyof typeof MaterialIcons.glyphMap;
    onPress?: () => void;
}

const records: MedicalList[] = [
    {
        name: 'Documents',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Family / Personal history',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Regular treatments',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Allergies',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Gynaecological follow-up',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Vaccines',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Surgical operations',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Lifestyle',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Measurements',
        icon: 'archive',
        button: 'chevron-right',
    }
];

export default function MedicalRecordsScreen() {

    return (
        <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
            <ScrollView>
                <View className="flex-1">
                    <View style={styles.container}>
                        {records.map((record, index) => (
                            <View key={`${record.name}-${index}`} style={styles.card}>
                                <MaterialIcons name={record.icon} size={28} color="#5085A8" />
                                <View>
                                    <Text>{record.name}</Text>
                                </View>
                                <TouchableOpacity>
                                    <MaterialIcons name={record.button} size={24} color="#3f3128" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: '20%',
        paddingLeft: '4%',
        paddingRight: '4%',


    },
    card: {
        flexDirection: 'row',
        paddingTop: '4%',
        marginBottom: '10%',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})