import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/useLanguageStore';
import { languages } from '@/data/languages';
import { images } from '@/constants/images';

export const Header = () => {
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();
  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);
  const rawName = user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-x-3">
        <View className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border overflow-hidden">
          {selectedLanguage ? (
            <Text className="text-2xl">{selectedLanguage.flagEmoji}</Text>
          ) : (
            <Ionicons name="globe-outline" size={24} color="#6C4EF5" />
          )}
        </View>
        <Text className="h3 text-text-primary">
          Hola, {firstName}! 👋
        </Text>
      </View>

      <View className="flex-row items-center gap-x-4">
        <View className="flex-row items-center gap-x-1.5">
          <Image 
            source={images.streakFire} 
            className="w-6 h-6" 
            resizeMode="contain"
          />
          <Text className="font-poppins-semibold text-[17px] text-streak">12</Text>
        </View>
        
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="notifications-outline" size={26} color="#0D132B" />
          <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
