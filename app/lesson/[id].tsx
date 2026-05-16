import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { images } from "@/constants/images";

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lesson = useMemo(() => lessons.find((l) => l.id === id), [id]);
  const unit = useMemo(() => units.find((u) => u.id === lesson?.unitId), [lesson]);
  const language = useMemo(
    () => languages.find((l) => l.id === unit?.languageId),
    [unit]
  );

  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isSubtitlesOn, setIsSubtitlesOn] = React.useState(true);
  
  const [bgImageError, setBgImageError] = React.useState(false);
  const [userImageError, setUserImageError] = React.useState(false);

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">Lesson not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 px-6 py-2 bg-primary rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mr-3"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-gray-900">AI Teacher</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              <Text className="text-xs text-gray-500 font-medium">Online</Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full border border-gray-200"
            accessibilityRole="button"
            accessibilityLabel="Toggle video camera"
          >
            <Ionicons name="videocam" size={20} color="#4B5563" />
          </TouchableOpacity>
          <View 
            className="h-10 px-3 flex-row items-center justify-center rounded-full border border-gray-200"
            accessibilityLabel={`Lesson progress: ${lesson.order}`}
          >
            <Text className="text-gray-900 font-bold">{lesson.order}</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full border border-gray-200"
            accessibilityRole="button"
            accessibilityLabel="View participants"
          >
            <Ionicons name="person-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot / Video Placeholder Area */}
        <View className="mx-4 mt-4 h-[440px] rounded-[32px] overflow-hidden relative shadow-lg">
          {/* Background Room Image Placeholder */}
          <Image 
            source={bgImageError ? images.lessonHeaderCafe : { uri: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' }} 
            className="absolute inset-0 w-full h-full opacity-40"
            blurRadius={10}
            onError={() => setBgImageError(true)}
            accessible={true}
            accessibilityLabel="Blurred room background"
          />
          <View className="absolute inset-0 bg-gray-200/50" />
          
          <Image 
            source={images.mascotWelcome} 
            className="w-full h-full"
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Mascot illustration welcoming the user"
          />
          
          {/* User Preview Placeholder */}
          {isCameraOn && (
            <View className="absolute top-6 right-6 w-24 h-32 bg-white rounded-2xl border-2 border-white shadow-xl overflow-hidden">
               <Image 
                source={userImageError ? images.mascotLogo : { uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=300&auto=format&fit=crop' }} 
                className="w-full h-full"
                onError={() => setUserImageError(true)}
                accessible={true}
                accessibilityLabel="Your video preview"
              />
            </View>
          )}

          {/* Teacher Speech Bubble */}
          <View className="absolute bottom-8 left-6 right-6">
            <View className="bg-white p-5 rounded-[24px] shadow-xl relative">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-xl font-bold text-gray-900 leading-tight">
                    {lesson.activities[0]?.type === 'phrase' ? lesson.activities[0].phrase?.phrase : '¡Muy bien!'}
                  </Text>
                  <Text className="text-base text-gray-600 mt-1 font-medium">
                    {lesson.activities[0]?.type === 'phrase' ? lesson.activities[0].phrase?.translation : 'That was great! 👏'}
                  </Text>
                </View>
                <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
                  <Ionicons name="volume-medium" size={24} color="#6C4EF5" />
                </TouchableOpacity>
              </View>
              {/* Triangle pointer for bubble */}
              <View 
                className="absolute -bottom-2 right-10"
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 12,
                  borderRightWidth: 12,
                  borderTopWidth: 12,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: 'white',
                }}
              />
            </View>
          </View>
        </View>

        {/* Controls Row */}
        <View className="flex-row items-center justify-around px-4 mt-10">
          <View className="items-center">
            <TouchableOpacity 
              onPress={() => setIsCameraOn(!isCameraOn)}
              className={`w-[68px] h-[68px] rounded-full items-center justify-center shadow-md border ${isCameraOn ? 'bg-white border-gray-50' : 'bg-gray-100 border-gray-200'}`}
              accessibilityRole="button"
              accessibilityLabel="Toggle camera"
              accessibilityState={{ selected: isCameraOn }}
            >
              <Ionicons name={isCameraOn ? "videocam" : "videocam-off"} size={26} color={isCameraOn ? "#374151" : "#9CA3AF"} />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Camera</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity 
              onPress={() => setIsMicOn(!isMicOn)}
              className={`w-[68px] h-[68px] rounded-full items-center justify-center shadow-md border ${isMicOn ? 'bg-white border-gray-50' : 'bg-gray-100 border-gray-200'}`}
              accessibilityRole="button"
              accessibilityLabel="Toggle microphone"
              accessibilityState={{ selected: isMicOn }}
            >
              <Ionicons name={isMicOn ? "mic" : "mic-off"} size={26} color={isMicOn ? "#374151" : "#9CA3AF"} />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Mic</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity 
              onPress={() => setIsSubtitlesOn(!isSubtitlesOn)}
              className={`w-[68px] h-[68px] rounded-full items-center justify-center shadow-md border ${isSubtitlesOn ? 'bg-white border-gray-50' : 'bg-gray-100 border-gray-200'}`}
              accessibilityRole="button"
              accessibilityLabel="Toggle subtitles"
              accessibilityState={{ selected: isSubtitlesOn }}
            >
              <MaterialIcons name={isSubtitlesOn ? "subtitles" : "subtitles-off"} size={26} color={isSubtitlesOn ? "#374151" : "#9CA3AF"} />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Subtitles</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-[68px] h-[68px] bg-red-500 rounded-full items-center justify-center shadow-lg"
              accessibilityRole="button"
              accessibilityLabel="End call"
            >
              <MaterialIcons name="call-end" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">End Call</Text>
          </View>
        </View>

        {/* Lesson Feedback Stats */}
        <View className="mx-4 mt-10 mb-8 bg-white border border-gray-100 rounded-[32px] p-6 flex-row justify-between shadow-sm">
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-[13px] mb-2">Speaking</Text>
            <Text style={{ color: "#22C55E", fontWeight: "bold", fontSize: 17 }}>Excellent</Text>
          </View>
          <View className="w-[1px] h-10 bg-gray-100 self-center" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-[13px] mb-2">Pronunciation</Text>
            <Text style={{ color: "#3B82F6", fontWeight: "bold", fontSize: 17 }}>Great</Text>
          </View>
          <View className="w-[1px] h-10 bg-gray-100 self-center" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-[13px] mb-2">Grammar</Text>
            <Text style={{ color: "#9333EA", fontWeight: "bold", fontSize: 17 }}>Good</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
