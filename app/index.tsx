import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center gap-y-4">
      <Text className="h1 text-center text-purple">Lingua</Text>
      <Link href="/onboarding" className="btn-secondary">
        <Text className="btn-secondary-text">Go to Onboarding</Text>
      </Link>
    </View>
  );
}
