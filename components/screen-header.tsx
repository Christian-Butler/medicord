import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
};

export default function ScreenHeader({
  title,
  showBack = true,
  onBackPress,
  rightElement,
  backgroundColor = "#fff",
  style,
}: ScreenHeaderProps) {
  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  }

  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <MaterialIcons name="chevron-left" size={34} color="#000" />
          </Pressable>
        ) : null}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.side}>
        {rightElement ? rightElement : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 96,
    paddingTop: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D8EEF3",
  },

  side: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
});