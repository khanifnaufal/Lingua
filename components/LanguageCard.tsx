import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Language } from '@/types/learning';
import { Ionicons } from '@expo/vector-icons';

interface LanguageCardProps {
  language: Language;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ 
  language, 
  isSelected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(language.id)}
      activeOpacity={0.7}
      className={`flex-row items-center p-4 mb-3 rounded-2xl border-2 ${
        isSelected 
          ? 'border-purple bg-purple/5' 
          : 'border-border bg-white'
      }`}
      style={{
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.1 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Flag Circle */}
      <View className="w-12 h-12 rounded-full bg-surface items-center justify-center mr-4 overflow-hidden border border-border">
        <Text className="text-2xl">{language.flagEmoji}</Text>
      </View>

      {/* Language Info */}
      <View className="flex-1">
        <Text className="h4 text-text-primary">{language.name}</Text>
        <Text className="body-sm text-text-secondary">
          {language.learnerCount} learners
        </Text>
      </View>

      {/* Selection Indicator */}
      <View className="ml-2">
        {isSelected ? (
          <View className="bg-purple rounded-full p-1">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );
};
