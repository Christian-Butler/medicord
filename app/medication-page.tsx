import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function MedicationScreen() {
    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScreenHeader title="Medication" />
            <ScrollView style={{ paddingTop: '4%' }}>
                <View style={styles.buttonContainer}>
                    <MaterialIcons name="add" size={26} color="#0D5175" />
                    <Text style={{ fontWeight: 500, color: '#0D5175', fontSize: 16 }}> Create Medication Routine </Text>
                </View>
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