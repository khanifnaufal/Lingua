import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '@/types/learning';

interface LessonListItemProps {
  lesson: Lesson;
  status: 'completed' | 'in-progress' | 'locked';
  onPress: () => void;
}

export const LessonListItem = ({ lesson, status, onPress }: LessonListItemProps) => {
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-white rounded-xl p-5 mb-4 border-2 ${
        isInProgress ? 'border-purple' : 'border-gray-100'
      } flex-row items-center justify-between shadow-card`}
    >
      <View className="flex-1">
        <Text className="text-text-secondary font-medium mb-1 text-body-sm">
          Lesson {lesson.order}
        </Text>
        <Text className={`text-h3 ${isInProgress ? 'text-purple' : 'text-text-primary'}`}>
          {lesson.title}
        </Text>
        {isInProgress && (
          <Text className="text-purple font-medium mt-1 text-body-md">
            In progress
          </Text>
        )}
        {isLocked && (
          <Text className="text-text-secondary text-body-sm mt-1">
            0 / 6 lessons
          </Text>
        )}
      </View>

      <View className="ml-4">
        {isCompleted && (
          <View className="bg-success rounded-full p-1 w-7 h-7 items-center justify-center">
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        )}
        {isInProgress && lesson.imageUrl && (
          <Image
            source={{ uri: lesson.imageUrl }}
            className="w-12 h-12 rounded-lg"
            resizeMode="cover"
          />
        )}
        {isLocked && (
          <Ionicons name="lock-closed-outline" size={24} color="#A1A1A1" />
        )}
      </View>
    </TouchableOpacity>
  );
};
