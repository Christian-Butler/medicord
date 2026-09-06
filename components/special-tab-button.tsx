import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';


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
		<Pressable onPress={handlePress} style={styles.button}>
			<MaterialIcons name="medical-services" size={28} color={'#8A9BA3'} />
			<Text style={{ fontSize: 12, color: '#8A9BA3', fontWeight: 500 }}>{title}</Text>
		</Pressable>
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