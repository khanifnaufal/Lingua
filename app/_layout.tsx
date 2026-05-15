import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";

// Using local font files from assets/fonts as they are already available 
// and more reliable than the @expo-google-fonts package in this environment.
const Poppins_400Regular = require("../assets/fonts/Poppins-Regular.ttf");
const Poppins_500Medium = require("../assets/fonts/Poppins-Medium.ttf");
const Poppins_600SemiBold = require("../assets/fonts/Poppins-SemiBold.ttf");
const Poppins_700Bold = require("../assets/fonts/Poppins-Bold.ttf");

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

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
