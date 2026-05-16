import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";

const { width } = Dimensions.get("window");
const TAB_BAR_WIDTH = width;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  learn: "book",
  "ai-teacher": "videocam",
  chat: "chatbubble-ellipses",
  profile: "person",
};

const LABELS: Record<string, string> = {
  index: "Home",
  learn: "Learn",
  "ai-teacher": "AI Teacher",
  chat: "Chat",
  profile: "Profile",
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(state.index * TAB_WIDTH, {
      duration: 250,
      easing: Easing.linear,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Background Circle Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          { width: TAB_WIDTH },
        ]}
      >
        <View style={styles.circle} />
      </Animated.View>

      {/* Tab Items */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(route.name);
          }
        };

        const iconName = ICONS[route.name] || "help-circle";
        const label = LABELS[route.name] || route.name;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isFocused ? iconName : (`${iconName}-outline` as any)}
                size={24}
                color={isFocused ? "#FFFFFF" : Colors.textSecondary}
              />
            </View>
            
            {!isFocused && (
              <Text 
                style={styles.label}
                numberOfLines={1}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 85,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20, // Space for home indicator
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.linguaPurple,
    // Add a slight shadow to make it pop
    shadowColor: Colors.linguaPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
