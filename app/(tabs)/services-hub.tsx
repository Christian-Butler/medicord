import { useTranslation } from "react-i18next";
import { Text, View } from 'react-native';
const Page = () => {
    const { t } = useTranslation();
    return (
        <View>
            <Text>{t("services-hub.title")}</Text>
        </View>
    );
};
export default Page;