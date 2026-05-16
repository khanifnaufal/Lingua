import { useOAuth } from "@clerk/expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useRouter, usePathname } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import SocialButton from "./SocialButton";

// Required for web browser to complete auth session
WebBrowser.maybeCompleteAuthSession();

export default function OAuthButtons() {
  const router = useRouter();
  const pathname = usePathname();

  // In @clerk/expo v2, we must use useOAuth, not useSSO (which is web-only in v2)
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const handleOAuth = useCallback(
    async (provider: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
      try {
        let startOAuthFlow;
        if (provider === "oauth_google") startOAuthFlow = startGoogleOAuthFlow;
        else if (provider === "oauth_facebook") startOAuthFlow = startFacebookOAuthFlow;
        else if (provider === "oauth_apple") startOAuthFlow = startAppleOAuthFlow;

        if (!startOAuthFlow) return;

        const { createdSessionId, setActive } = await startOAuthFlow({
          redirectUrl: Linking.createURL(pathname, { scheme: "duolingoclone" }),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/");
        } else {
          // If there is no createdSessionId, that means the user needs to complete
          // the MFA flow or provide additional information before sign up can be completed.
        }
      } catch (err) {
        console.error("OAuth error:", err);
      }
    },
    [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow, router]
  );

  return (
    <View>
      <SocialButton
        provider="google"
        onPress={() => handleOAuth("oauth_google")}
      />
      <SocialButton
        provider="facebook"
        onPress={() => handleOAuth("oauth_facebook")}
      />
      <SocialButton
        provider="apple"
        onPress={() => handleOAuth("oauth_apple")}
      />
    </View>
  );
}
