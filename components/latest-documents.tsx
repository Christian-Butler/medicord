import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableWithoutFeedback, View } from "react-native";

export default function LatestDocuments() {

  const { t } = useTranslation();

  return (
    <View className=" px-4 pt-10">
      <Text className="pl-2 text-[24px] font-normal text-black">
        {t(`latest-documents.latest`)}
      </Text>

      {/* Example document card */}

      <TouchableWithoutFeedback

        onPress={() => router.push({
          pathname: "/mr-documents"
        })}>
        <View className="mt-6 bg-[white] rounded-xl px-4 py-4 my-2">
          <View className="flex-row items-center">
            <FontAwesome5
              name="clipboard-list"
              size={40}
              color="#0D5175"
              solid
            />

            <View className="ml-4 flex-1">
              <View className="flex-row items-end">
                <Text className="text-lg font-medium text-black">
                  {t(`latest-documents.document`)}
                </Text>
                <View className="mx-2 py-1 px-4 rounded-[10px] border-[2px] border-[#54B85D] bg-[#B1EDB1]">
                  <Text className="text-[12px] font-medium text-black">
                    {t(`latest-documents.new`)}
                  </Text>
                </View>
              </View>
              <Text className="mt-1 text-base text-gray-600">
                {t(`latest-documents.received`)}
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
