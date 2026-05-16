import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/expo";

export default function Index() {
  const { signOut, sessionId } = useAuth();

  return (
    <View className="flex-1 justify-center items-center gap-y-4 px-6">
      <Text className="h1 text-center text-purple">Welcome to Lingua!</Text>
      <Text className="body-md text-center text-text-secondary mb-4">
        You have successfully signed in.
      </Text>
      
      <TouchableOpacity 
        className="btn-primary w-full"
        onPress={() => signOut()}
      >
        <Text className="btn-primary-text text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
