import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function MedCalender() {
  return (
    <View style={styles.container}>
      <Ionicons name="calendar-outline" size={100} style={styles.headerImage} />
      <Text style={styles.title}>Medical Calendar</Text>
      <Text style={styles.text}>
        This is the medical calendar component. You can edit this screen by
        modifying the file at components/ui/medcalender.tsx
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  headerImage: {
    color: "#808080",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
