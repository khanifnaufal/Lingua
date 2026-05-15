import AuthInput from "@/components/AuthInput";
import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = () => {
    // In a real app, this would call an API
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Header */}
          <View className="flex-row items-center py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-surface"
            >
              <Ionicons name="chevron-back" size={24} color="#0D132B" />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View className="mt-4 mb-8">
            <Text className="h1">Create your account</Text>
            <Text className="body-md mt-1">
              Start your language journey today ✨
            </Text>
          </View>

          {/* Mascot */}
          <View className="items-center mb-8">
            <Image
              source={images.mascotAuth}
              style={{ width: 160, height: 160 }}
              contentFit="contain"
            />
          </View>

          {/* Form */}
          <View>
            <AuthInput
              label="Email"
              placeholder="alex@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <TouchableOpacity
              className="btn-primary mt-4"
              activeOpacity={0.8}
              onPress={handleSignUp}
            >
              <Text className="btn-primary-text text-center">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 body-sm text-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Social Auth */}
          <View>
            <SocialButton provider="google" onPress={() => {}} />
            <SocialButton provider="facebook" onPress={() => {}} />
            <SocialButton provider="apple" onPress={() => {}} />
          </View>

          {/* Footer Link */}
          <View className="flex-row justify-center mt-auto py-8">
            <Text className="body-md">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text className="font-poppins-bold text-purple">Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        email={email}
      />
    </SafeAreaView>
  );
}
