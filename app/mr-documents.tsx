import ScreenHeader from "@/components/screen-header";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Documents() {

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View >

                <Text>You’re the only one having access to the files and able to manage them.</Text>
            </View>
        </ScrollView>

    );
}
