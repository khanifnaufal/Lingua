import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';

interface UnitHeaderProps {
  unitTitle: string;
  unitSubtitle: string;
  activeTab: 'lessons' | 'practice';
  onTabChange: (tab: 'lessons' | 'practice') => void;
}

export const UnitHeader = ({ unitTitle, unitSubtitle, activeTab, onTabChange }: UnitHeaderProps) => {
  const router = useRouter();

  return (
    <View className="bg-white">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#0D132B" />
        </TouchableOpacity>
        <View className="items-center flex-1">
          <Text className="text-h3 text-text-primary text-center" numberOfLines={1}>{unitTitle}</Text>
          <Text className="text-body-sm text-text-secondary">{unitSubtitle}</Text>
        </View>
        <TouchableOpacity className="p-2 -mr-2">
          <Ionicons name="bookmark" size={24} color="#6C4EF5" />
        </TouchableOpacity>
      </View>

      {/* Header Image */}
      <View className="px-6 mb-6">
        <View className="w-full h-48 rounded-3xl overflow-hidden">
          <Image 
            source={images.lessonHeaderCafe} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 mb-6">
        <View className="flex-row bg-surface p-1.5 rounded-3xl flex-1">
          <TouchableOpacity 
            onPress={() => onTabChange('lessons')}
            className={`flex-1 py-3 items-center rounded-2xl relative ${
              activeTab === 'lessons' 
                ? 'bg-white shadow-card' 
                : ''
            }`}
          >
            <Text className={`text-body-lg font-bold ${activeTab === 'lessons' ? 'text-purple' : 'text-text-secondary'}`}>
              Lessons
            </Text>
            {activeTab === 'lessons' && (
              <View className="absolute bottom-0 w-12 h-1 bg-purple rounded-full mb-1" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onTabChange('practice')}
            className={`flex-1 py-3 items-center rounded-2xl relative ${
              activeTab === 'practice' 
                ? 'bg-white shadow-card' 
                : ''
            }`}
          >
            <Text className={`text-body-lg font-bold ${activeTab === 'practice' ? 'text-purple' : 'text-text-secondary'}`}>
              Practice
            </Text>
            {activeTab === 'practice' && (
              <View className="absolute bottom-0 w-12 h-1 bg-purple rounded-full mb-1" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
