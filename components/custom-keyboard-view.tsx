import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const ios = Platform.OS == 'ios';

export default function CustomKeyboardView({ children, inChat }) {
  const kavConfig = inChat ? { keyboardVerticalOffset: 90 } : {};

  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      style={{ flex: 1 }}
      {...kavConfig}
    >
      {children}
    </KeyboardAvoidingView>
  );
}