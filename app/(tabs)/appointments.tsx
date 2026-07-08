import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AppointmentsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
            <ScrollView stickyHeaderIndices={[1, 3]} contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="flex-1" style={{ height: 26 }}>
                </View>
                <View style={styles.stickyHeaderContainer}>
                    <Text style={styles.stickyHeader}> Upcoming </Text>
                </View>
                <View></View>
                <View style={styles.stickyHeaderContainer}>
                    <Text style={styles.stickyHeader}> Past </Text>
                </View>
            </ScrollView >
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    stickyHeaderContainer: {
        backgroundColor: '#EEF9FB',
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