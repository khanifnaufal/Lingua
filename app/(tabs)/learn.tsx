import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-purple/10 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">📚</Text>
        </View>
        <Text className="h1 text-purple mb-2">Learn Path</Text>
        <Text className="body-md text-center text-text-secondary">
          Your personalized language journey is being prepared. Stay tuned!
        </Text>
      </View>
    </SafeAreaView>
  );
}
