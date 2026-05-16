import AuthInput from "@/components/AuthInput";
import OAuthButtons from "@/components/OAuthButtons";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useSignIn } from "@clerk/expo";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!signIn) return;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        if (error.code === "session_exists") {
          router.replace("/" as any);
          return;
        }
        setError(error.message || "An error occurred");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }) => {
            if (session?.currentTask) return;
            router.replace("/" as any);
          },
        });
      } else {
        console.error("SignIn status not complete:", signIn.status);
        setError("Sign in incomplete. Status: " + signIn.status);
      }
    } catch (err: any) {
      console.error("SignIn error:", err);
      setError(err.errors?.[0]?.message || err.message || "An error occurred");
    }
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
            <Text className="h1">Welcome back!</Text>
            <Text className="body-md mt-1">
              Log in to continue your journey 🚀
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

            {error ? (
              <Text className="text-red-500 font-poppins-medium text-[14px] mt-2 text-center">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              className="btn-primary mt-4"
              activeOpacity={0.8}
              onPress={handleSignIn}
            >
              <Text className="btn-primary-text text-center">
                Sign In
              </Text>
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
          <OAuthButtons />

          {/* Footer Link */}
          <View className="flex-row justify-center mt-auto py-8">
            <Text className="body-md">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text className="font-poppins-bold text-purple">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
