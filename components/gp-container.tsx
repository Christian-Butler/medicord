import { useGps } from "@/src/hooks/useGps";
import { useProfile } from "@/src/hooks/useProfile";
import { useUpdateGp } from "@/src/hooks/useUpdateGp";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function GpContainer() {
  const { gps, loading, error } = useGps();
  const { gp: currentGp, needsGp } = useProfile();
  const { loading: updating, error: updateError, handleUpdateGp } = useUpdateGp();
  const [searchQuery, setSearchQuery] = useState("");
  const [timedQuery, setTimedQuery] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const queryGps = useMemo(() => {
    const trimmedSearchQuery = timedQuery.trim().toLowerCase();
    if (!trimmedSearchQuery) return gps;
    return gps.filter((gp) =>
      [gp.full_name, gp.practice_name, gp.practice_location]
        .some((field) => field?.toLowerCase().includes(trimmedSearchQuery))
    );
  }, [gps, timedQuery]);

  async function handleChooseGp(gpId: string) {
    const updated = await handleUpdateGp(gpId);
    if (updated) router.back();
  }

  return (
    <View>
      {needsGp ? (
        <Text style={styles.intro}>{t(`gp-container.intro`)}</Text>
      ) : null}

      <View
        style={styles.search}
        className="h-14 flex-row rounded-2xl items-center border border-[#0D5175] bg-white px-5"
      >
        <Search size={18} color="#7B8A91" />
        <TextInput
          placeholder={t(`Search GP`)}
          placeholderTextColor="#7B8A91"
          className="ml-4 flex-1 text-lg text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>
      <ScrollView>
        {loading ? <Text style={styles.statusText}>{t(`gp-container.loading`)}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {updateError ? <Text style={styles.errorText}>{updateError}</Text> : null}
        {!loading && !error && queryGps.length === 0 ? (
          <Text style={styles.statusText}>{t(`gp-container.noGp`)}</Text>
        ) : null}

        <View style={styles.containerMain}>
          {queryGps.map((gp) => {
            const isCurrentGp = gp.id === currentGp?.id;
            const avatar =
              gps.avatar_url || null;
            return (
              <View key={gp.id} style={styles.card}>
                <Text style={styles.name}>{gp.full_name}</Text>
                <View className="flex-row items-center">
                  <Text style={styles.profession}>
                    {gp.practice_name}
                  </Text>
                  <Text className="mx-1">
                    •
                  </Text>
                  <Text style={styles.profession}>
                    {gp.practice_location}
                  </Text>
                </View>

                <Pressable
                  style={styles.containerButton}
                  className={isCurrentGp || updating ? "opacity-60" : ""}
                  accessibilityRole="button"
                  disabled={isCurrentGp || updating}
                  onPress={() => handleChooseGp(gp.id)}
                >
                  <Text className="color-[white] font-medium text-[16px]">
                    {isCurrentGp ? t(`Current GP`) : t(`Choose Gp`)}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginTop: 18,
    marginHorizontal: 24,
    fontSize: 16,
    color: "#000",
  },
  search: {
    width: 380,
    marginTop: 18,
    marginBottom: 20,
    alignSelf: "center",
  },
  statusText: {
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#B42318",
  },
  containerMain: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 18,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  profession: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "400",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5085A8",
    height: 50,
    borderRadius: 14,
    marginTop: 14,
  },
});