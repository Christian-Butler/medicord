import DoctorHeader from "@/components/doctor-details-header";
import React from "react";
import { ScrollView, View } from "react-native";

export default function DoctorDetails() {
    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScrollView>
                <View className="flex-1">
                    <DoctorHeader name={"Dr. Eric Smith"} profession={"Cardiologist"} />
                </View>
            </ScrollView>
        </View>
    );
}

