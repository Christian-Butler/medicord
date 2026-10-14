import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
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
            name: 'Gyneacological follow-up',
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

    const { t } = useTranslation();

    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScreenHeader title="Medical records" />
            <ScrollView>
                <View className="mt-[30px] mb-20">
                    {records.map((record, index) => (
                        <TouchableOpacity
                            className="flex-row items-center justify-between rounded-2xl bg-white my-[6px] mx-4 py-4 px-2"
                            key={`${record.name}-${index}`}
                            onPress={record.onPress}
                        >
                            <View className="flex-row items-center">
                                <MaterialIcons name={record.icon} size={42} color="#0D5175" />
                                <Text className="mx-6">{t(`medical-records.${record.name}`)}</Text>
                            </View>
                            <View className="mr-2">
                                <MaterialIcons name={record.button} size={26} color="#3f3128" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaProvider >
    )
}