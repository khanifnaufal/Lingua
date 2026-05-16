import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { languages } from "@/data/languages";

export default function Index() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();

  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);

  return (
    <View className="flex-1 justify-center items-center gap-y-4 px-6">
      <Text className="h1 text-center text-purple">Welcome to Lingua!</Text>
      
      {selectedLanguage ? (
        <View className="items-center mb-4">
          <Text className="body-md text-center text-text-secondary">
            You are learning:
          </Text>
          <Text className="h3 text-center text-text-primary">
            {selectedLanguage.flagEmoji} {selectedLanguage.name}
          </Text>
        </View>
      ) : (
        <Text className="body-md text-center text-text-secondary mb-4">
          Please select a language to start learning.
        </Text>
      )}
      
      <TouchableOpacity 
        className="btn-primary w-full"
        onPress={() => router.push("/language-selection")}
      >
        <Text className="btn-primary-text text-center">
          {selectedLanguage ? "Change Language" : "Choose Language"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="btn-secondary w-full"
        onPress={() => signOut()}
      >
        <Text className="btn-secondary-text text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
