import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const PlanItem = ({ icon, title, subtitle, completed, color }: any) => (
  <View className="flex-row items-center justify-between py-3">
    <View className="flex-row items-center gap-x-4">
      <View 
        className="w-12 h-12 rounded-2xl items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {icon}
      </View>
      <View>
        <Text className="font-poppins-semibold text-base text-text-primary">{title}</Text>
        <Text className="font-poppins-regular text-sm text-text-secondary">{subtitle}</Text>
      </View>
    </View>
    
    <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${completed ? 'bg-purple border-purple' : 'border-border'}`}>
      {completed && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
  </View>
);

export const TodayPlan = () => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="h3">Today's plan</Text>
        <TouchableOpacity>
          <Text className="font-poppins-semibold text-purple">View all</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-y-1">
        <PlanItem 
          title="Lesson"
          subtitle="At the café"
          completed={true}
          color="#6C4EF5"
          icon={<Ionicons name="book" size={24} color="white" />}
        />
        <PlanItem 
          title="AI Conversation"
          subtitle="Talk about your day"
          completed={false}
          color="#8E77F7"
          icon={<Ionicons name="headset" size={24} color="white" />}
        />
        <PlanItem 
          title="New words"
          subtitle="10 words"
          completed={false}
          color="#FF7272"
          icon={<MaterialCommunityIcons name="cards" size={24} color="white" />}
        />
      </View>
    </View>
  );
};
