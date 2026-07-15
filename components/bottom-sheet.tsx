import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

type ServiceItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
};

const ServiceButton = ({ icon, label, onPress }: ServiceItem) => (
  <TouchableOpacity style={styles.serviceIcon} onPress={onPress}>
    <MaterialIcons name={icon} size={52} color="#5085A8" />
    <Text style={styles.serviceName}>{label}</Text>
  </TouchableOpacity>
);

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
};

export const BottomSheetHub = ({ bottomSheetRef }: Props) => {
  const snapPoints = useMemo(() => ["45%"], []);

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const navigateFromSheet = (pathname: string) => {
    closeSheet();

    requestAnimationFrame(() => {
      router.push(pathname as never);
    });
  };

  const services: ServiceItem[] = [
    {
      icon: "calendar-month",
      label: "Appointments",
      onPress: () => navigateFromSheet("/appointments"),
    },
    {
      icon: "archive",
      label: "Medical records",
      onPress: () => navigateFromSheet("/medical-records"),
    },
    {
      icon: "medication",
      label: "Medication",
      onPress: () => navigateFromSheet("/medications"),
    },
    {
      icon: "forum",
      label: "Messages",
      onPress: () => navigateFromSheet("/messages"),
    },
    {
      icon: "change-circle",
      label: "Order repeat medication",
      onPress: () => navigateFromSheet("/repeat-medication"),
    },
    {
      icon: "favorite",
      label: "Your doctors",
      onPress: () => navigateFromSheet("/your-doctors"),
    },
  ];

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#EFF7F8" }}
    >
      <BottomSheetView style={styles.sheetContent}>
        <Text style={styles.title}>Services hub</Text>

        <FlatList
          style={{ width: "100%" }}
          data={services}
          renderItem={({ item }) => <ServiceButton {...item} />}
          keyExtractor={(item) => item.label}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  grid: {},
  column: {
    flex: 1,
    height: 120,
    alignItems: "center",
  },
  serviceIcon: {
    alignItems: "center",
    gap: 6,
    padding: 8,
    width: "33%",
  },
  serviceName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    maxWidth: 80,
  },
});

export default BottomSheetHub;