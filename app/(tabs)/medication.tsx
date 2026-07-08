import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";


export default function MedicationScreen() {
    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScrollView>
                <View className="flex-1" style={{ height: 26 }}>
                </View>
                <View>
                    <Text> Upcoming </Text>
                    <View style={styles.seperator} />
                    <View></View>
                </View>

                <View>
                    <Text> Past </Text>
                </View>
            </ScrollView >
        </View>

    )
}


const styles = StyleSheet.create({
    seperator: {
        height: 1,
        backgroundColor: "red",
        marginVertical: 1,
    },
});