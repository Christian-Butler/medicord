import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function AppointmentsScreen() {
    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <ScrollView stickyHeaderIndices={[1, 3]} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.stickyHeaderContainer}>
                    <Text style={styles.stickyHeader}> Upcoming </Text>
                </View>
                <View></View>
                <View style={styles.stickyHeaderContainer}>
                    <Text style={styles.stickyHeader}> Past </Text>
                </View>
            </ScrollView >
        </SafeAreaProvider>

    )
}


const styles = StyleSheet.create({
    stickyHeaderContainer: {
        paddingVertical: '6%',
        paddingHorizontal: '4%',
        borderBottomWidth: 1,
        borderBottomColor: '#BEC9CA',
    },
    stickyHeader: {
        fontWeight: '600',
        fontSize: 20,
    }
});