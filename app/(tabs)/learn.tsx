import React, { useState, useMemo } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { units } from "@/data/units";
import { lessons as allLessons } from "@/data/lessons";
import { UnitHeader } from "@/components/lessons/UnitHeader";
import { LessonListItem } from "@/components/lessons/LessonListItem";

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();
  const { completedLessonIds, activeLessonId, setActiveLesson } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<'lessons' | 'practice'>('lessons');
  const [refreshing, setRefreshing] = useState(false);

  // Filter data for the selected language
  const languageUnits = useMemo(() => 
    units.filter(u => u.languageId === selectedLanguageId), 
    [selectedLanguageId]
  );

  const currentUnit = languageUnits[0] || units[0]; // Default to first unit if not found

  const unitLessons = useMemo(() => 
    allLessons.filter(l => l.unitId === currentUnit.id).sort((a, b) => a.order - b.order),
    [currentUnit.id]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLessonPress = (lessonId: string) => {
    setActiveLesson(lessonId);
    router.push({ pathname: "/lesson/[id]", params: { id: lessonId } } as any);
  };

  const completedCount = unitLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const totalCount = unitLessons.length;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <UnitHeader 
        unitTitle={currentUnit.title}
        unitSubtitle={`Unit ${currentUnit.order} • ${completedCount} / ${totalCount} lessons`}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C4EF5"]} />
        }
      >
        <View className="py-2">
          {unitLessons.map((lesson) => {
            let status: 'completed' | 'in-progress' | 'locked' = 'locked';
            
            if (completedLessonIds.includes(lesson.id)) {
              status = 'completed';
            } else if (activeLessonId === lesson.id || (!activeLessonId && unitLessons.findIndex(l => !completedLessonIds.includes(l.id)) === unitLessons.indexOf(lesson))) {
              status = 'in-progress';
            }

            return (
              <LessonListItem 
                key={lesson.id}
                lesson={lesson}
                status={status}
                onPress={() => handleLessonPress(lesson.id)}
                totalLessons={totalCount}
                completedLessons={completedCount}
              />
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
