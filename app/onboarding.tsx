import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLORS, SIZES } from '../constants/theme';

const slides = [
    {
        id: 1,
        title: "Welcome to Medicord",
        description: "We're glad that you've chosen this app for a better medical experience.\n\nFollow through a quick onboarding to familiarise yourself with our features and to finalise your profile!",
        image: require('../assets/images/Medicord-Logo.png'),
    },
    {
        id: 2,
        title: "Discover our services",
        description: "In Medicord you can book appointments with doctors, create a medication routine for any treatment you are following, and fill in any medical history that will be useful to know!",
        image: require('../assets/images/onboard-img1.webp'),
    },
    {
        id: 3,
        title: "Choose a GP",
        description: "After you finish the onboarding process you will have to find your GP to access to all the doctor booking services.",
        image: require('../assets/images/onboard-img2.webp'),
    }
]

export default function OnboardingScreen() {

    const buttonLabel = (label: string) => {
        return (
            <View style={{
                padding: 12,
            }}>
                <Text style={{
                    paddingRight: 12,
                    color: COLORS.primary || "#5085A8",
                    fontWeight: 500,
                    fontSize: SIZES.h4 || 16,
                }}>
                    {label}
                </Text>
            </View>
        )
    }
    return (
        <AppIntroSlider
            data={slides}
            renderItem={({ item }) => {
                return (
                    <View style={{
                        backgroundColor: 'white',
                        flex: 1,
                        alignItems: 'center',
                        padding: 12,
                        paddingTop: 250,
                    }}>
                        <Image
                            source={item.image}
                            style={{
                                marginBottom: 25,
                                width: SIZES.width - 80,
                                height: 150,
                            }}
                            resizeMode="contain"
                        />
                        <Text style={{
                            fontWeight: 500,
                            color: 'black',
                            fontSize: SIZES.h1,
                        }}>
                            {item.title}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: 400,
                                color: 'black',
                                fontSize: SIZES.h4,
                                paddingTop: 14
                            }}>
                            {item.description}
                        </Text>
                    </View>
                )
            }}
            activeDotStyle={{
                backgroundColor: COLORS.primary,
                width: 30,
            }}
            renderNextButton={() => buttonLabel("Next")}
            renderDoneButton={() => buttonLabel("Done")}
            onDone={async () => {
                try {
                    await AsyncStorage.setItem('@OnboardingCompleted', 'true');
                    router.replace("/(tabs)");
                } catch (e) {
                    console.error("Failed to save Onboarding  status", e);
                }

            }}
        />
    )
}
