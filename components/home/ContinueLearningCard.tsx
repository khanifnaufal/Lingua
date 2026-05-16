import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useLanguageStore } from '@/store/useLanguageStore';
import { languages } from '@/data/languages';
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';

export const ContinueLearningCard = () => {
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();
  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);

  if (!selectedLanguage) return null;

  return (
    <View className="px-6 mb-8">
      <View className="bg-purple rounded-[32px] p-6 relative overflow-hidden shadow-lg shadow-purple/30">
        {/* Background shapes/illustrations would go here */}
        <View className="z-10 w-2/3">
          <Text className="font-poppins-medium text-white/80 mb-1">Continue learning</Text>
          <Text className="font-poppins-bold text-[32px] text-white mb-2 leading-tight">
            {selectedLanguage.name}
          </Text>
          <Text className="font-poppins-medium text-white/90 mb-6">
            A1 • Unit 3
          </Text>

          <TouchableOpacity 
            className="bg-white rounded-2xl py-3 px-6 self-start"
            onPress={() => router.push('/learn')}
          >
            <Text className="font-poppins-bold text-purple text-base">Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Palace Illustration */}
        <Image 
          source={images.palace} 
          className="absolute -right-4 -bottom-2 w-48 h-48"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
