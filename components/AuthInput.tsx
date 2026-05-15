import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, TextInputProps } from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
}

export default function AuthInput({ label, isPassword, ...props }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <View
        className={`bg-white border-[1.5px] rounded-2xl px-4 py-3 transition-colors ${
          isFocused ? "border-purple" : "border-border"
        }`}
      >
        <Text className="font-poppins-medium text-[12px] text-text-secondary uppercase tracking-wider">
          {label}
        </Text>
        <View className="flex-row items-center mt-1">
          <TextInput
            className="flex-1 font-poppins-semibold text-[16px] text-text-primary p-0"
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="#A0AEC0"
            {...props}
          />
          {isPassword && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#718096"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
