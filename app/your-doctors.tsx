import ScreenHeader from "@/components/screen-header";
import { useFavouriteDoctors } from "@/src/hooks/useFavoriteDoctors";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function YourDoctors() {
  const { doctors, loading, error, refetch } = useFavouriteDoctors();
  const { toggle } = useToggleFavourite();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = doctors.filter((doc) =>
    doc.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEF9FB" }}>
      <ScreenHeader title="Your Doctors" />

      <View className="mx-4 mt-4 mb-2 h-14 flex-row rounded-2xl border-2 items-center border-[#778888] bg-white px-4">
        <Search size={20} color="#778888" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#7B8A91"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="ml-3 flex-1 text-base text-black"
        />
      </View>

      {loading ? (
        <Text className="text-center mt-8 text-[15px] text-black">Loading...</Text>
      ) : error ? (
        <Text className="text-center mt-8 text-[15px] text-[#B42318]">{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/doctor-details",
                params: { doctorId: item.id },
              })}
              className="flex-row items-center justify-between px-4 py-4 border-b border-[#BEC9CA]"
            >
              <View className="flex-row items-center">
                {item.avatar_url ? (
                  <Image
                    source={{ uri: item.avatar_url }}
                    className="h-14 w-14 rounded-full"
                  />
                ) : (
                  <View className="h-14 w-14 rounded-full bg-[#D7E8ED]" />
                )}
                <View className="ml-4">
                  <Text className="text-[16px] font-bold text-black">{item.full_name}</Text>
                  <Text className="text-[14px] text-[#555]">{item.specialty}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={async () => {
                  await toggle(item.id);
                  refetch();
                }}
              >
                <MaterialIcons name="star" size={28} color="#E7BF3C" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-[#7B8A91]">No favourite doctors yet.</Text>
          }
        />
      )}
    </SafeAreaProvider>
  );
}