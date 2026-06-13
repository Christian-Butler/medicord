import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


type Props = {
	onPress: () => void;
	title: string;
};

export const SpecialTabButton = ({ onPress, title }: Props) => {
	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onPress();
	};

	return (
		<TouchableOpacity onPress={handlePress} style={styles.button}>
			<MaterialIcons name="medical-services" size={28} color={'#9BA1A6'} />
			<Text style={{ fontSize: 10 }}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		marginTop: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
});

export default SpecialTabButton;