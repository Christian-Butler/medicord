import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import WeeklyCalendar from './calendar';

interface Doctor {
    name: string;
    avatar: string;
    closestDay: string;
}

const doctors: Doctor[] = [
    {
        name: 'Dr. Eric Smith',
        avatar: 'https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg',
        closestDay: 'Tue. April 14th',
    },
    {
        name: 'Dr. Peter Chambellain',
        avatar:
            'https://images.pexels.com/photos/8460094/pexels-photo-8460094.jpeg',
        closestDay: 'Mon. June 2nd',
    },
    {
        name: 'Dr. Anna Karsinsky',
        avatar: 'https://images.pexels.com/photos/8376300/pexels-photo-8376300.jpeg',
        closestDay: 'Wed. July 9th',
    },
    {
        name: 'Dr. Sophia Sunderland',
        avatar: 'https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg',
        closestDay: 'Thu. August 12th',
    },
];

const Card: React.FC = () => {
    return (
        <View>
            <View style={styles.search} className="h-14 flex-row rounded-2xl border-2 items-center border-[#09516D] bg-white px-5">
                <Search size={18} color="#09516D" />

                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#7B8A91"
                    className="ml-4 flex-1 text-lg text-black"
                />

            </View>
            <View style={styles.containerMain}>
                {doctors.map((doctor, index) => (
                    <View key={`${doctor.name}-${index}`} style={styles.card}>

                        <View style={styles.doctorInfo}>
                            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
                            <View style={styles.doctorText}>
                                <Text style={styles.name}>{doctor.name}</Text>
                                <Text style={styles.profession}>Cardiologist</Text>
                            </View>
                            <TouchableOpacity style={styles.favorite}>
                                <MaterialIcons name="star-border" size={24} color="#3f3128" />
                            </TouchableOpacity>
                        </View>
                        <View>

                        </View>
                        <View style={styles.slot}>
                            <Text>Closest available slot :</Text>
                            <Text style={styles.day}>{doctor.closestDay}</Text>
                        </View>
                        <View style={styles.bookContainer}>
                            <View>
                                <WeeklyCalendar />
                                <Pressable
                                    style={styles.containerButton}
                                    accessibilityRole="button"
                                    onPress={() =>
                                        router.push({
                                            pathname: '/doctor-details',
                                            params: {
                                                name: doctor.name,
                                                closestDay: doctor.closestDay
                                            }
                                        })
                                    }
                                >
                                    <Text style={styles.text2}>Book Now</Text>
                                    <MaterialIcons name="chevron-right" size={26} color="#fff" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    search: {
        width: 350,
        marginBottom: 20,
        alignSelf: 'center',
    },
    containerMain: {
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    card: {
        padding: 10,
        marginBottom: 10,
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 30,
        marginRight: 12,
    },
    doctorText: {
        width: 250
    },
    favorite: {
        marginLeft: 40,
        flexDirection: 'row',
    },
    name: {
        fontSize: 16,
        fontWeight: '600'
    },
    profession: {
        fontSize: 14,
        fontWeight: '300'
    },
    day: {
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: '#fff',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 2,
        borderColor: '#0D5175',
        borderRadius: 14
    },
    slot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingBottom: 12
    },
    bookContainer: {
    },
    containerButton: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '40%',
        flexDirection: 'row',
        backgroundColor: '#5085A8',
        color: '#fff',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 6,
        borderRadius: 12,

    },
    text2: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#fff'
    }
});

export default Card;