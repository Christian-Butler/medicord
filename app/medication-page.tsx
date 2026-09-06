import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function MedicationScreen() {
    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScreenHeader title="Medication" />
            <ScrollView className="pt-6 h-56">
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/medication-formpage",
                        })
                    }>
                    <View style={styles.buttonContainer}>
                        <MaterialIcons name="add" size={26} color="#0D5175" />
                        <Text style={{ fontWeight: 500, color: '#0D5175', fontSize: 16 }}> Create Medication Routine </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView >
        </SafeAreaProvider>

    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        borderRadius: 14,
        borderWidth: 2,
        paddingVertical: '4%',
        paddingHorizontal: '4%',
        borderColor: "#0D5175",
        backgroundColor: '#fff',
    },
});