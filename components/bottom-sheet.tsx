import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

//using Typescript to define the data fields of the grid
type ServiceItem = {
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    label: string;
    onPress?: () => void;
};

const services: ServiceItem[] = [
    { icon: 'calendar-month', label: 'Appointments' },
    { icon: 'archive', label: 'Medical records' },
    { icon: 'medication', label: 'Medication' },
    { icon: 'forum', label: 'Messages' },
    { icon: 'change-circle', label: 'Order repeat medication' },
    { icon: 'favorite', label: 'Your doctors' },
];

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

    // useMemo stops snapPoints array being created on each render
    const snapPoints = useMemo(() => ['45%'], []);
    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
        />
    );
    const flatServices = services.flat();
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
                <Text style={styles.title}>Services hub</Text>
                <FlatList
                    style={{ width: "100%" }}
                    data={flatServices}
                    renderItem={({ item }) => (
                        <ServiceButton {...item} />
                    )}
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
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 40,
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',

    },
    grid: {
    },
    column: {
        flex: 1,
        height: 120,
        alignItems: 'center'
    },
    serviceIcon: {
        alignItems: 'center',
        gap: 6,
        padding: 8,
        width: '33%'
    },
    serviceName: {
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
        maxWidth: 80,
    },
});

export default BottomSheetHub;