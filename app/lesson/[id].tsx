import React, { useMemo, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { 
  useStreamVideoClient, 
  Call, 
  StreamCall, 
  useCallStateHooks, 
  CallingState 
} from "@stream-io/video-react-native-sdk";

import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { images } from "@/constants/images";
import { usePostHog } from "@/lib/posthog";

// Inner component for an active Call (wrapped in StreamCall)
interface AudioCallContentProps {
  call: Call;
  lesson: any;
  language: any;
  isSubtitlesOn: boolean;
  setIsSubtitlesOn: (on: boolean) => void;
  handleEndCall: () => void;
  clerkUser: any;
  agentStatus: "idle" | "connecting" | "connected" | "failed";
  setAgentStatus: (status: "idle" | "connecting" | "connected" | "failed") => void;
}

function AudioCallContent({
  call,
  lesson,
  language,
  isSubtitlesOn,
  setIsSubtitlesOn,
  handleEndCall,
  clerkUser,
  agentStatus,
  setAgentStatus
}: AudioCallContentProps) {
  const { useCallCallingState, useMicrophoneState, useLocalParticipant, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { microphone, isMute, isSpeakingWhileMuted } = useMicrophoneState();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  const [bgImageError, setBgImageError] = useState(false);
  const [userImageError, setUserImageError] = useState(false);

  const [teacherTranscript, setTeacherTranscript] = useState("");
  const [userTranscript, setUserTranscript] = useState("");

  // Listen for custom transcription events sent from the Python backend agent
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      const payload = event.custom;
      if (payload && payload.type === "transcript") {
        const { speaker, text, mode } = payload;
        if (speaker === "agent") {
          // Clear user transcript when agent starts speaking
          setUserTranscript("");
          
          if (mode === "delta") {
            setTeacherTranscript((prev) => prev + text);
          } else if (mode === "replacement" || mode === "final") {
            setTeacherTranscript(text);
          }
        } else if (speaker === "user") {
          // Clear teacher transcript when user starts speaking
          setTeacherTranscript("");
          
          if (mode === "delta") {
            setUserTranscript((prev) => prev + text);
          } else if (mode === "replacement" || mode === "final") {
            setUserTranscript(text);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [call]);

  // Sync mic state from the SDK
  const isMicOn = !isMute;

  const handleToggleMic = async () => {
    try {
      await microphone.toggle();
    } catch (err) {
      console.error("Error toggling microphone:", err);
    }
  };

  // Determine speaking state for local user
  const isSpeaking = localParticipant?.isSpeaking;

  // Check if the agent participant is present in the call
  const isAgentConnected = participants.some((p) => p.userId === "ai-teacher-agent");

  // Automatically transition agent connection status based on presence in Call
  useEffect(() => {
    if (isAgentConnected) {
      if (agentStatus === "connecting" || agentStatus === "idle") {
        setAgentStatus("connected");
      }
    } else {
      if (agentStatus === "connected") {
        setAgentStatus("failed");
      }
    }
  }, [isAgentConnected, agentStatus]);

  // Map CallingState to status indicator settings
  let statusText = "Connecting...";
  let statusDotColor = "bg-yellow-500";

  switch (callingState) {
    case CallingState.JOINING:
      statusText = "Connecting...";
      statusDotColor = "bg-yellow-500";
      break;
    case CallingState.JOINED:
      if (isMute) {
        statusText = "Muted";
        statusDotColor = "bg-orange-500";
      } else {
        statusText = "Online";
        statusDotColor = "bg-green-500";
      }
      break;
    case CallingState.RECONNECTING:
      statusText = "Reconnecting...";
      statusDotColor = "bg-yellow-500";
      break;
    case CallingState.RECONNECTING_FAILED:
      statusText = "Connection Failed";
      statusDotColor = "bg-red-500";
      break;
    case CallingState.LEFT:
      statusText = "Call Ended";
      statusDotColor = "bg-gray-400";
      break;
    default:
      statusText = "Online";
      statusDotColor = "bg-green-500";
      break;
  }

  // Map agent status
  let agentStatusText = "Agent: Idle";
  let agentStatusDotColor = "bg-gray-400";
  switch (agentStatus) {
    case "connecting":
      agentStatusText = "Agent: Connecting...";
      agentStatusDotColor = "bg-yellow-500 animate-pulse";
      break;
    case "connected":
      agentStatusText = "Agent: Connected";
      agentStatusDotColor = "bg-green-500";
      break;
    case "failed":
      agentStatusText = "Agent: Failed";
      agentStatusDotColor = "bg-red-500";
      break;
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={handleEndCall} 
            className="mr-3"
            accessibilityRole="button"
            accessibilityLabel="Go back and end call"
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-gray-900">AI Teacher</Text>
            <View className="flex-row items-center flex-wrap">
              <View className="flex-row items-center mr-3">
                <View className={`w-2 h-2 rounded-full mr-1.5 ${statusDotColor}`} />
                <Text className="text-xs text-gray-500 font-medium">
                  {statusText}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-1.5 ${agentStatusDotColor}`} />
                <Text className="text-xs text-gray-500 font-medium">
                  {agentStatusText}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row items-center space-x-3">
          <View 
            className="h-10 px-3 flex-row items-center justify-center rounded-full border border-gray-200"
            accessibilityLabel={`Lesson progress: ${lesson.order}`}
          >
            <Text className="text-gray-900 font-bold">{lesson.order}</Text>
          </View>
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
          
          {/* User Preview Placeholder (Audio-Only) */}
          <View className="absolute top-6 right-6 w-24 h-32 bg-slate-900 rounded-2xl border-2 border-white shadow-xl overflow-hidden items-center justify-center">
            {isSpeaking && (
              <View className="absolute inset-0 bg-green-500/20 rounded-2xl animate-ping" />
            )}
            
            {clerkUser?.imageUrl ? (
              <Image 
                source={{ uri: clerkUser.imageUrl }} 
                className={`w-14 h-14 rounded-full border-2 ${isSpeaking ? 'border-green-500' : 'border-white/50'}`}
                resizeMode="cover"
                onError={() => setUserImageError(true)}
                accessible={true}
                accessibilityLabel="Your avatar"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center border-2 border-white/50">
                <Text className="text-white font-bold text-lg">
                  {clerkUser?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            
            {/* Speak/Mic Status Badge */}
            <View className="absolute bottom-2 bg-black/60 px-2 py-0.5 rounded-full flex-row items-center space-x-1">
              <Ionicons 
                name={isMute ? "mic-off" : isSpeaking ? "volume-medium" : "mic"} 
                size={10} 
                color={isMute ? "#EF4444" : isSpeaking ? "#10B981" : "#FFFFFF"} 
              />
              <Text className="text-[8px] text-white font-bold uppercase">
                {isMute ? "Mute" : isSpeaking ? "Speaking" : "On"}
              </Text>
            </View>

            {/* Speaking while muted warning badge */}
            {isSpeakingWhileMuted && (
              <View className="absolute top-2 left-2 bg-red-500 p-1 rounded-full">
                <Ionicons name="mic-off" size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          {/* User Speech Bubble (Playful conversation style) */}
          {isSubtitlesOn && userTranscript ? (
            <View className="absolute top-6 left-6 right-[128px] bg-green-500 p-4 rounded-[20px] shadow-lg border border-green-400">
              <Text className="text-[10px] text-white/80 font-bold uppercase tracking-wider mb-0.5">You</Text>
              <Text className="text-base font-bold text-white leading-tight">
                {userTranscript}
              </Text>
              {/* Triangle pointer pointing right towards the avatar */}
              <View 
                className="absolute -right-1.5 top-10"
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderTopWidth: 8,
                  borderBottomWidth: 8,
                  borderLeftWidth: 8,
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: '#22C55E',
                }}
              />
            </View>
          ) : null}

          {/* Teacher Speech Bubble */}
          <View className="absolute bottom-8 left-6 right-6">
            <View className="bg-white p-5 rounded-[24px] shadow-xl relative">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-xs text-primary font-bold uppercase tracking-wider">AI Teacher</Text>
                    <View className={`w-1.5 h-1.5 rounded-full ml-1.5 ${agentStatus === 'connected' ? 'bg-green-500' : agentStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
                  </View>
                  <Text className="text-xl font-bold text-gray-900 leading-tight">
                    {agentStatus === 'connecting' ? 'Connecting to Prof. Lingua...' :
                     agentStatus === 'failed' ? 'Could not connect to Prof. Lingua.' :
                     isSubtitlesOn && teacherTranscript ? teacherTranscript : (lesson.activities[0]?.type === 'phrase' ? lesson.activities[0].phrase?.phrase : '¡Muy bien!')}
                  </Text>
                  {isSubtitlesOn && !teacherTranscript && (
                    <Text className="text-base text-gray-600 mt-1 font-medium">
                      {agentStatus === 'connecting' ? 'Please wait a moment while I join.' :
                       agentStatus === 'failed' ? 'Please check your connection or restart the lesson.' :
                       lesson.activities[0]?.type === 'phrase' ? lesson.activities[0].phrase?.translation : 'That was great! 👏'}
                    </Text>
                  )}
                </View>
                <View className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
                  {agentStatus === 'connecting' ? (
                    <ActivityIndicator size="small" color="#6C4EF5" />
                  ) : (
                    <Ionicons name="volume-medium" size={24} color="#6C4EF5" />
                  )}
                </View>
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
              disabled={true}
              className="w-[68px] h-[68px] rounded-full items-center justify-center shadow-md border bg-gray-100 border-gray-200 opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Camera (Disabled for audio-only lesson)"
            >
              <Ionicons name="videocam-off" size={26} color="#9CA3AF" />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Camera</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity 
              onPress={handleToggleMic}
              className={`w-[68px] h-[68px] rounded-full items-center justify-center shadow-md border ${isMicOn ? 'bg-white border-gray-50' : 'bg-gray-100 border-gray-200'}`}
              accessibilityRole="button"
              accessibilityLabel="Toggle microphone"
              accessibilityState={{ selected: isMicOn }}
            >
              <Ionicons name={isMicOn ? "mic" : "mic-off"} size={26} color={isMicOn ? "#374151" : "#EF4444"} />
            </TouchableOpacity>
            <Text className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">{isMicOn ? 'Mic' : 'Muted'}</Text>
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
              onPress={handleEndCall}
              className="w-[68px] h-[68px] bg-red-500 rounded-full items-center justify-center shadow-lg active:bg-red-600"
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

// Sub-component for loading / error / ended states (when call is not active)
interface AudioCallPlaceholderProps {
  lesson: any;
  language: any;
  status: "connecting" | "error" | "ended";
  onRetry: () => void;
  onBack: () => void;
}

function AudioCallPlaceholder({
  lesson,
  language,
  status,
  onRetry,
  onBack
}: AudioCallPlaceholderProps) {
  const [bgImageError, setBgImageError] = useState(false);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-3">
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-gray-900">AI Teacher</Text>
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full mr-1.5 ${status === 'connecting' ? 'bg-yellow-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
              <Text className="text-xs text-gray-500 font-medium">
                {status === 'connecting' ? 'Connecting...' : status === 'error' ? 'Connection Error' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 items-center justify-center p-6 bg-white">
        {status === 'connecting' ? (
          <View className="items-center">
            {/* Pulsing visual */}
            <View className="relative w-40 h-40 items-center justify-center mb-6">
              <View className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <View className="absolute inset-4 bg-primary/20 rounded-full" />
              <Image 
                source={images.mascotLogo} 
                className="w-24 h-24 rounded-full border border-gray-100 bg-white"
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 text-center px-4 mb-2">
              Preparing Your Audio Lesson
            </Text>
            <Text className="text-sm font-medium text-gray-500 text-center px-8">
              Connecting you with the AI Teacher in {language?.name || 'Spanish'}...
            </Text>
            <View className="mt-8 flex-row items-center space-x-2">
              <ActivityIndicator size="small" color="#6C4EF5" />
              <Text className="text-primary font-bold">Setting up secure call...</Text>
            </View>
          </View>
        ) : status === 'error' ? (
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-red-50 items-center justify-center mb-6">
              <Ionicons name="alert-circle" size={54} color="#EF4444" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 text-center mb-2">
              Connection Failed
            </Text>
            <Text className="text-sm font-medium text-gray-500 text-center px-8 mb-8">
              We couldn't connect to the audio classroom. Please check your network and try again.
            </Text>
            <View className="w-full space-y-3 px-4">
              <TouchableOpacity 
                onPress={onRetry}
                className="w-full py-4 bg-primary rounded-2xl items-center justify-center shadow-md active:bg-primary-dark"
              >
                <Text className="text-white font-bold text-base">Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onBack}
                className="w-full py-4 border border-gray-200 rounded-2xl items-center justify-center active:bg-gray-50"
              >
                <Text className="text-gray-700 font-bold text-base">Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-gray-50 items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={54} color="#10B981" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 text-center mb-2">
              Lesson Complete!
            </Text>
            <Text className="text-sm font-medium text-gray-500 text-center px-8 mb-8">
              Great job practicing your speaking and listening skills. Keep it up!
            </Text>
            <TouchableOpacity 
              onPress={onBack}
              className="w-64 py-4 bg-primary rounded-2xl items-center justify-center shadow-md active:bg-primary-dark"
            >
              <Text className="text-white font-bold text-base">Return to Learn</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Main screen Wrapper component
export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const client = useStreamVideoClient();

  const lesson = useMemo(() => lessons.find((l) => l.id === id), [id]);
  const unit = useMemo(() => units.find((u) => u.id === lesson?.unitId), [lesson]);
  const language = useMemo(() => languages.find((l) => l.id === unit?.languageId), [unit]);

  const [call, setCall] = useState<Call | null>(null);
  const [callStatus, setCallStatus] = useState<"connecting" | "joined" | "error" | "ended">("connecting");
  const [agentStatus, setAgentStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle");
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const posthog = usePostHog();
  const startTimeRef = React.useRef<number>(Date.now());
  const isCompletedRef = React.useRef<boolean>(false);

  // Track lesson_started on mount, and lesson_abandoned on unmount
  useEffect(() => {
    startTimeRef.current = Date.now();
    isCompletedRef.current = false;

    if (lesson && language) {
      posthog.capture("lesson_started", {
        lesson_id: lesson.id,
        language: language.name,
        lesson_number: lesson.order,
      });
    }

    return () => {
      if (!isCompletedRef.current && lesson) {
        const timeIntoLesson = Math.round((Date.now() - startTimeRef.current) / 1000);
        posthog.capture("lesson_abandoned", {
          lesson_id: lesson.id,
          time_into_lesson_seconds: timeIntoLesson,
          last_question_index: 0,
        });
      }
    };
  }, [lesson?.id, language?.name]);

  // Store agentSessionId in ref to always capture latest value in unmount closure
  const agentSessionIdRef = React.useRef<string | null>(null);
  useEffect(() => {
    agentSessionIdRef.current = agentSessionId;
  }, [agentSessionId]);

  // Watchdog timer: if agent is stuck connecting for too long, mark as failed
  useEffect(() => {
    if (agentStatus === "connecting") {
      const timer = setTimeout(() => {
        setAgentStatus("failed");
      }, 25000);
      return () => clearTimeout(timer);
    }
  }, [agentStatus]);

  useEffect(() => {
    if (!client || !lesson || !language) return;

    let activeCall: Call | null = null;
    let isMounted = true;

    const setupCall = async () => {
      try {
        if (isMounted) {
          setCallStatus("connecting");
          setAgentStatus("idle");
        }
        
        const response = await fetch("/api/stream-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: clerkUser?.id || "",
            lessonId: lesson.id,
            languageId: language.id
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to initialize call: ${response.statusText}`);
        }

        const { callId } = await response.json();
        
        if (!isMounted) return;

        const newCall = client.call("default", callId);
        activeCall = newCall;

        await newCall.join({ create: true });
        
        // Ensure camera is disabled by default for audio-only call
        await newCall.camera.disable();

        if (isMounted) {
          setCall(newCall);
          setCallStatus("joined");
          setAgentStatus("connecting");
        }

        // Start the agent
        try {
          const agentResponse = await fetch("/api/agent-start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callId: callId,
              callType: "default"
            }),
          });
          
          if (!agentResponse.ok) {
            throw new Error(`Failed to start agent: ${agentResponse.statusText}`);
          }
          
          const agentData = await agentResponse.json();
          if (isMounted) {
            setAgentSessionId(agentData.session_id);
          }
        } catch (err) {
          console.error("Error starting agent session:", err);
          if (isMounted) {
            setAgentStatus("failed");
          }
        }
      } catch (error) {
        console.error("Error joining call:", error);
        if (isMounted) {
          setCallStatus("error");
          setAgentStatus("failed");
        }
      }
    };

    setupCall();

    return () => {
      isMounted = false;
      if (activeCall) {
        const callId = activeCall.id;
        const sessId = agentSessionIdRef.current;
        if (sessId) {
          fetch("/api/agent-stop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callId: callId,
              sessionId: sessId
            })
          }).catch((err) => console.error("Error leaving agent in cleanup:", err));
        }
        if (activeCall.state.callingState !== CallingState.LEFT) {
          activeCall.leave().catch((err) => console.error("Error leaving call in cleanup:", err));
        }
      }
    };
  }, [client, lesson?.id, language?.id, retryCount]);

  const handleEndCall = async () => {
    isCompletedRef.current = true;
    if (call) {
      try {
        if (agentSessionId) {
          await fetch("/api/agent-stop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callId: call.id,
              sessionId: agentSessionId
            })
          }).catch((err) => console.error("Error during agent-stop manual call:", err));
        }
        await call.leave();
      } catch (err) {
        console.error("Error during call.leave():", err);
      }
    }
    setCallStatus("ended");
    router.back();
  };

  const handleRetry = () => {
    setCall(null);
    setRetryCount((prev) => prev + 1);
  };

  const handleBack = () => {
    router.back();
  };

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">Lesson not found</Text>
        <TouchableOpacity 
          onPress={handleBack}
          className="mt-4 px-6 py-2 bg-primary rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render sub-components based on connection state
  if (callStatus === "joined" && call) {
    return (
      <StreamCall call={call}>
        <AudioCallContent
          call={call}
          lesson={lesson}
          language={language}
          isSubtitlesOn={isSubtitlesOn}
          setIsSubtitlesOn={setIsSubtitlesOn}
          handleEndCall={handleEndCall}
          clerkUser={clerkUser}
          agentStatus={agentStatus}
          setAgentStatus={setAgentStatus}
        />
      </StreamCall>
    );
  }

  return (
    <AudioCallPlaceholder
      lesson={lesson}
      language={language}
      status={callStatus === "joined" ? "connecting" : callStatus}
      onRetry={handleRetry}
      onBack={handleBack}
    />
  );
}
