import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrescriptionsTabScreen() {
  return (
    <SafeAreaView>
      <Card className="m-4 p-6">
        s
        <Heading size="lg" className="mb-4 text-center">
          <Text>Prescriptions</Text>
        </Heading>
        <Heading size="md" className="text-center">
          <Text>
            {" "}
            This is the prescriptions tab. You can edit this screen by modifying
            the file at app/(tabs)/prescriptions.tsx
          </Text>
        </Heading>
        <Ionicons
          name="document-text-outline"
          size={100}
          style={{ color: "#808080", alignSelf: "center", marginBottom: 20 }}
        />
        <Box className="m-4 p-6 bg-blue-100 rounded-lg">
          <Heading size="md" className="text-center">
            <Text> No new prescriptions available.</Text>
            <Ionicons
              name="alarm-outline"
              size={50}
              style={{
                color: "#808080",
                alignSelf: "flex-start",
                marginBottom: 20,
              }}
            />
          </Heading>
        </Box>
      </Card>
    </SafeAreaView>
  );
}
