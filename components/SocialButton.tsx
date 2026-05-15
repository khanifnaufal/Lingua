import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SocialProvider = "google" | "facebook" | "apple";

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

export default function SocialButton({ provider, onPress }: SocialButtonProps) {
  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return {
          label: "Continue with Google",
          icon: <Ionicons name="logo-google" size={20} color="#EA4335" />,
        };
      case "facebook":
        return {
          label: "Continue with Facebook",
          icon: <Ionicons name="logo-facebook" size={20} color="#1877F2" />,
        };
      case "apple":
        return {
          label: "Continue with Apple",
          icon: <Ionicons name="logo-apple" size={20} color="#000000" />,
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center justify-center bg-white border-[1.5px] border-border rounded-2xl py-4 mb-3"
      onPress={onPress}
    >
      <View className="absolute left-6">{config.icon}</View>
      <Text className="font-poppins-semibold text-[16px] text-text-primary">
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}
