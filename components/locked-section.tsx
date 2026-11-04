import { useProfile } from "@/src/hooks/useProfile";
import React from "react";
import { View } from "react-native";

type LockedSectionProps = {
  children: React.ReactNode;
};

export default function LockedSection({ children }: LockedSectionProps) {
  const { needsGp } = useProfile();

  return (
    <View
      pointerEvents={needsGp ? "none" : "auto"}
      className={needsGp ? "opacity-60" : ""}
    >
      {children}
    </View>
  );
}