import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center items-center px-6">
        <View 
          style={{ backgroundColor: `${Colors.streak}20` }}
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
        >
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="h1 text-purple mb-2">Your Profile</Text>
        <Text className="body-md text-center text-text-secondary">
          Track your progress, view achievements, and manage your account.
        </Text>
      </View>
    </SafeAreaView>
  );
}
