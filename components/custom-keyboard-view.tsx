import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const ios = Platform.OS == 'ios';

export default function CustomKeyboardView({ children, inChat }) {
    let kavConfig = {};
    let scrollViewConfig = {};

    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 90 };
        scrollViewConfig = { contentContainerStyle: { flex: 1 } };
    }
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
            style={{ flex: 1 }}
            {...kavConfig}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                {...scrollViewConfig}
            >
                {
                    children
                }

            </ScrollView>
        </KeyboardAvoidingView>
    )
}