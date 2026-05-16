import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/home/Header";
import { DailyGoalCard } from "@/components/home/DailyGoalCard";
import { ContinueLearningCard } from "@/components/home/ContinueLearningCard";
import { TodayPlan } from "@/components/home/TodayPlan";

export default function Index() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { setSelectedLanguageId } = useLanguageStore();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <DailyGoalCard />
        <ContinueLearningCard />
        <TodayPlan />
      </ScrollView>
    </SafeAreaView>
  );
}
