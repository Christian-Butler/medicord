import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface MedicalList {
    name: string;
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    button: React.ComponentProps<typeof MaterialIcons>['name'];
    onPress?: () => void;
}

const records: MedicalList[] = [
    {
        name: 'Documents',
        icon: 'article',
        button: 'chevron-right',
    },
    {
        name: 'Family / Personal history',
        icon: 'person-search',
        button: 'chevron-right',
    },
    {
        name: 'Regular treatments',
        icon: 'pending-actions',
        button: 'chevron-right',
    },
    {
        name: 'Allergies',
        icon: 'coronavirus',
        button: 'chevron-right',
    },
    {
        name: 'Gynecological follow-up',
        icon: 'female',
        button: 'chevron-right',
    },
    {
        name: 'Vaccines',
        icon: 'vaccines',
        button: 'chevron-right',
    },
    {
        name: 'Surgical operations',
        icon: 'monitor-heart',
        button: 'chevron-right',
    },
    {
        name: 'Lifestyle',
        icon: 'directions-walk',
        button: 'chevron-right',
    },
    {
        name: 'Measurements',
        icon: 'design-services',
        button: 'chevron-right',
    }
];

export default function MedicalRecordsScreen() {

    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScreenHeader title="Medical records" />
            <ScrollView>
                <View style={styles.container}>
                    {records.map((record, index) => (
                        <View key={`${record.name}-${index}`} style={styles.card}>
                            <MaterialIcons name={record.icon} size={32} color="#5085A8" />
                            <View>
                                <Text>{record.name}</Text>
                            </View>
                            <TouchableOpacity>
                                <MaterialIcons name={record.button} size={24} color="#3f3128" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: '4%',
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