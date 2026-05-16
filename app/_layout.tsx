import "../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useLanguageStore } from "@/store/useLanguageStore";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// Using local font files from assets/fonts as they are already available 
// and more reliable than the @expo-google-fonts package in this environment.
const Poppins_400Regular = require("../assets/fonts/Poppins-Regular.ttf");
const Poppins_500Medium = require("../assets/fonts/Poppins-Medium.ttf");
const Poppins_600SemiBold = require("../assets/fonts/Poppins-SemiBold.ttf");
const Poppins_700Bold = require("../assets/fonts/Poppins-Bold.ttf");

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { selectedLanguageId, hasHydrated } = useLanguageStore();

  useEffect(() => {
    // Wait for Clerk and Zustand store hydration
    if (!isLoaded || !hasHydrated) return;

    const segment = segments[0];
    const inAuthGroup =
      segment === "onboarding" ||
      segment === "sign-in" ||
      segment === "sign-up";
    const inLanguageSelection = segment === "language-selection";

    if (!isSignedIn) {
      // Not signed in
      if (!inAuthGroup) {
        router.replace("/onboarding");
      }
    } else {
      // Signed in
      if (!selectedLanguageId) {
        // No language selected
        if (!inLanguageSelection) {
          router.replace("/language-selection");
        }
      } else {
        // Language selected
        if (inAuthGroup) {
          router.replace("/" as any);
        }
      }
    }
  }, [isSignedIn, isLoaded, segments, selectedLanguageId, hasHydrated, router]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null while fonts are loading — splash stays visible
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}
