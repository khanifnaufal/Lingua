import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Logo */}
      <View className="flex-row items-center justify-center mt-4">
        <Image
          source={images.mascotLogo}
          style={{ width: 40, height: 40 }}
          contentFit="contain"
        />
        <Text className="font-poppins-bold text-[28px] ml-2 text-text-primary">
          lingua
        </Text>
      </View>

      {/* Hero Section */}
      <View className="flex-1 px-8 justify-center">
        <View className="mb-8">
          <Text className="h1 text-text-primary">
            Your AI language{" "}
            <Text className="text-purple">teacher.</Text>
          </Text>
          <Text className="body-lg text-text-secondary mt-4">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot & Speech Bubbles */}
        <View className="items-center justify-center relative py-10">
          {/* Speech Bubble: Hello! */}
          <View
            className="absolute left-0 top-0 bg-[#E8F3FF] px-4 py-2 rounded-2xl rounded-bl-none shadow-sm"
            style={{ transform: [{ rotate: "-5deg" }] }}
          >
            <Text className="font-poppins-semibold text-[#0D132B]">Hello!</Text>
          </View>

          {/* Speech Bubble: ¡Hola! */}
          <View
            className="absolute right-0 top-4 bg-[#F0EEFF] px-4 py-2 rounded-2xl rounded-br-none shadow-sm"
            style={{ transform: [{ rotate: "10deg" }] }}
          >
            <Text className="font-poppins-semibold text-purple">¡Hola!</Text>
          </View>

          {/* Mascot */}
          <Image
            source={images.mascotWelcome}
            style={{ width: width * 0.7, height: width * 0.7 }}
            contentFit="contain"
          />

          {/* Speech Bubble: 你好! */}
          <View
            className="absolute right-4 bottom-12 bg-[#FFF0EE] px-4 py-2 rounded-2xl rounded-tr-none shadow-sm"
            style={{ transform: [{ rotate: "-8deg" }] }}
          >
            <Text className="font-poppins-semibold text-[#FF4D4F]">你好!</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-8 pb-10">
        <TouchableOpacity
          className="btn-primary flex-row items-center justify-center"
          activeOpacity={0.8}
          onPress={() => router.push("/sign-up")}
        >
          <Text className="btn-primary-text mr-2">Get Started</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
