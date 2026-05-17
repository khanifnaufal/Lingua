import AuthInput from "@/components/AuthInput";
import OAuthButtons from "@/components/OAuthButtons";
import { images } from "@/constants/images";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
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

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const posthog = usePostHog();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");

  const handleBack = () => {
    if (step === "mfa") {
      setStep("credentials");
      setMfaCode("");
      setError("");
    } else {
      router.back();
    }
  };

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
    posthog.capture("signin_attempt");

    try {
      // Use signIn.create to always initiate a fresh attempt and prevent stale state conflicts
      const res = await (signIn as any).create({
        strategy: "password",
        identifier: email,
        password,
      });

      // Destructure only the error from Clerk SDK's custom envelope
      const { error } = res || {};

      if (error) {
        if (error.code === "session_exists") {
          router.replace("/" as any);
          return;
        }
        setError(error.message || "An error occurred");
        return;
      }

      // Check state directly on the synchronously updated signIn class instance
      if (signIn.status === "complete") {
        const finalizeRes = await (signIn as any).finalize({
          navigate: ({ session }: { session: any }) => {
            if (session?.currentTask) return;
            router.replace("/" as any);
          },
        });
        const { error: finalizeErr } = finalizeRes || {};
        if (finalizeErr) {
          setError(finalizeErr.message || "Failed to finalize session");
          return;
        }
        posthog.capture("signin_completed");
      } else if (signIn.status === "needs_second_factor") {
        try {
          const factor = (signIn.supportedSecondFactors as any[])?.find(
            (f: any) => f.strategy === "phone_code" || f.strategy === "email_code"
          );
          if (factor) {
            if (factor.strategy === "phone_code") {
              const mfaRes = await (signIn as any).sendMFAPhoneCode();
              const { error: mfaErr } = mfaRes || {};
              if (mfaErr) {
                setError(mfaErr.message || "Failed to send SMS verification code");
                return;
              }
            } else if (factor.strategy === "email_code") {
              const mfaRes = await (signIn as any).sendEmailCode();
              const { error: mfaErr } = mfaRes || {};
              if (mfaErr) {
                setError(mfaErr.message || "Failed to send email verification code");
                return;
              }
            }
          }
          setStep("mfa");
        } catch (mfaPrepErr: any) {
          console.error("MFA Prep error:", mfaPrepErr);
          setError(mfaPrepErr.errors?.[0]?.message || mfaPrepErr.message || "Failed to prepare MFA verification");
        }
      } else {
        console.error("SignIn status not complete:", signIn.status);
        setError("Sign in incomplete. Status: " + signIn.status);
      }
    } catch (err: any) {
      console.error("SignIn error:", err);
      setError(err.errors?.[0]?.message || err.message || "An error occurred");
    }
  };

  const handleVerifyMFA = async () => {
  if (!signIn || !mfaCode) {
    setError("Verification code is required");
    return;
  }

  setError("");

  try {
    const verifyRes = await (signIn as any).verifyEmailCode({ code: mfaCode });
    const { error } = verifyRes || {};

    if (error) {
      setError(error.message || "Verification failed");
      return;
    }

    if (signIn.status === "complete") {
      const finalizeRes = await (signIn as any).finalize({
        navigate: ({ session }: { session: any }) => {
          if (session?.currentTask) return;
          router.replace("/" as any);
        },
      });
      const { error: finalizeErr } = finalizeRes || {};
      if (finalizeErr) {
        setError(finalizeErr.message || "Failed to finalize session");
        return;
      }
      posthog.capture("signin_completed");
    } else {
      setError("Verification incomplete. Status: " + signIn.status);
    }
  } catch (err: any) {
    console.error("MFA error:", err);
    setError(err.errors?.[0]?.message || err.message || "Verification failed");
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
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-surface"
            >
              <Ionicons name="chevron-back" size={24} color="#0D132B" />
            </TouchableOpacity>
          </View>

          {step === "mfa" ? (
            <>
              {/* Title Section */}
              <View className="mt-4 mb-8">
                <Text className="h1">Verification Code</Text>
                <Text className="body-md mt-1">
                  Please enter the 2FA verification code to secure your login.
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
                  label="Verification Code"
                  placeholder="123456"
                  value={mfaCode}
                  onChangeText={setMfaCode}
                  keyboardType="numeric"
                  maxLength={6}
                />

                {error ? (
                  <Text className="text-red-500 font-poppins-medium text-[14px] mt-2 text-center">
                    {error}
                  </Text>
                ) : null}

                <TouchableOpacity
                  className="btn-primary mt-4"
                  activeOpacity={0.8}
                  onPress={handleVerifyMFA}
                >
                  <Text className="btn-primary-text text-center">
                    Verify Code
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
