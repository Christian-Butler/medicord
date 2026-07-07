import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import ProfileHeader from "./../../components/header-profile";

interface MedicalList {
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    button: keyof typeof MaterialIcons.glyphMap;
    onPress?: () => void;
}

const records: MedicalList[] = [
    {
        name: 'Documents',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Family / Personal history',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Regular treatments',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Allergies',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Gynaecological follow-up',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Vaccines',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Surgical operations',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Lifestyle',
        icon: 'archive',
        button: 'chevron-right',
    },
    {
        name: 'Measurements',
        icon: 'archive',
        button: 'chevron-right',
    }
];

export default function HomeScreen() {

    return (
        <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
            <ScrollView>
                <ProfileHeader />
                <View className="flex-1">

                </View>
            </ScrollView>



        </SafeAreaView>
    );
}
