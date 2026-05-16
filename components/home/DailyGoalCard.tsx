import React from 'react';
import { View, Text, Image } from 'react-native';
import { images } from '@/constants/images';

export const DailyGoalCard = () => {
  const progress = 15;
  const goal = 20;
  const percentage = (progress / goal) * 100;

  return (
    <View className="px-6 mb-6">
      <View className="bg-[#FFF9F2] rounded-3xl p-5 flex-row justify-between items-center border border-[#FFE8CC]">
        <View className="flex-1 pr-4">
          <Text className="font-poppins-medium text-text-secondary mb-1">Daily goal</Text>
          <View className="flex-row items-baseline gap-x-1 mb-3">
            <Text className="font-poppins-bold text-[28px] text-text-primary">{progress}</Text>
            <Text className="font-poppins-medium text-lg text-text-secondary">/ {goal} XP</Text>
          </View>
          
          {/* Progress Bar Container */}
          <View className="h-2.5 w-full bg-[#FFE8CC] rounded-full overflow-hidden">
            <View 
              className="h-full bg-streak rounded-full" 
              style={{ width: `${percentage}%` }}
            />
          </View>
        </View>

        <Image 
          source={images.treasure} 
          className="w-20 h-20" 
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
