import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface MedicalList {
    name: string;
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    button: React.ComponentProps<typeof MaterialIcons>['name'];
    onPress?: () => void;
}

export default function MedicalRecordsScreen() {
    const router = useRouter();

    const records: MedicalList[] = [
        {
            name: 'Documents',
            icon: 'article',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-documents');
            }
        },
        {
            name: 'Family / Personal history',
            icon: 'person-search',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-history');
            }
        },
        {
            name: 'Regular treatments',
            icon: 'pending-actions',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-treatments');
            }
        },
        {
            name: 'Allergies',
            icon: 'coronavirus',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-allergies');
            }
        },
        {
            name: 'Gynecological follow-up',
            icon: 'female',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-gynecological');
            }
        },
        {
            name: 'Vaccines',
            icon: 'vaccines',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-vaccines');
            }
        },
        {
            name: 'Surgical operations',
            icon: 'monitor-heart',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-operations');
            }
        },
        {
            name: 'Lifestyle',
            icon: 'directions-walk',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-lifestyle');
            }
        },
        {
            name: 'Measurements',
            icon: 'design-services',
            button: 'chevron-right',
            onPress: () => {
                router.push('/mr-measurements');
            }
        }
    ];

    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScreenHeader title="Medical records" />
            <ScrollView>
                <View style={styles.container}>
                    {records.map((record, index) => (
                        <TouchableOpacity key={`${record.name}-${index}`} style={styles.card} onPress={record.onPress}>

                            <MaterialIcons name={record.icon} size={32} color="#5085A8" />
                            <View>
                                <Text>{record.name}</Text>
                            </View>

                            <MaterialIcons name={record.button} size={24} color="#3f3128" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaProvider >
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