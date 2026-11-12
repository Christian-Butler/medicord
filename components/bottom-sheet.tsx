import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/src/hooks/useProfile';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ServiceItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

const ServiceButton = ({ icon, label, onPress, disabled }: ServiceItem) => (
  <TouchableOpacity
    style={[styles.serviceIcon, disabled && styles.locked]}
    onPress={onPress}
    disabled={disabled}
  >
    <MaterialIcons name={icon} size={52} color="#5085A8" />
    <Text style={styles.serviceName}>{label}</Text>
  </TouchableOpacity>
);

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
};

export const BottomSheetHub = ({ bottomSheetRef }: Props) => {
  const router = useRouter();

  // useMemo stops snapPoints array being created on each render
  const snapPoints = useMemo(() => ['45%'], []);

  const { t } = useTranslation();
    const { needsGp } = useProfile();   
  const numColumns = 3;

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );
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
      icon: 'calendar-month', label: t(`bottom-sheet.apt`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/appointments');
      },
    },
    {
      icon: 'archive', label: t(`bottom-sheet.medR`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/medical-records');
      },
    },
    {
      icon: 'medication', label: t(`bottom-sheet.medN`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/medications');
      },
    },
    {
      icon: 'forum', label: t(`bottom-sheet.mess`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/messages');
      },
    },
    {
      icon: 'change-circle', label: t(`bottom-sheet.order`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/prescription-renewal');
      },
    },
    {
      icon: 'favorite', label: t(`bottom-sheet.doc`), onPress: () => {
        bottomSheetRef.current?.close();
        router.push('/your-doctors')
      }
    },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#EFF7F8' }}
    >
      <BottomSheetView style={styles.sheetContent}>
               <Text style={styles.title}>{t(`bottom-sheet.services`)}</Text>
        {needsGp ? (
          <Text style={styles.lockedNote}>{t(`bottom-sheet.chooseGp`)}</Text>
        ) : null}
        <FlatList
          key={`services-${numColumns}`}
          style={{ width: "100%" }}
          data={services}
           renderItem={({ item }) => (
            <ServiceButton {...item} disabled={needsGp} />
          )}
          keyExtractor={(item) => item.label}
          numColumns={numColumns}
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
   lockedNote: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: -28,
    marginBottom: 24,
  },
  locked: {
    opacity: 0.6,
  },
});

export default BottomSheetHub;