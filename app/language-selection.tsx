import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { languages } from '@/data/languages';
import { LanguageCard } from '@/components/LanguageCard';
import { useLanguageStore } from '@/store/useLanguageStore';
import { images } from '@/constants/images';
import { usePostHog } from '@/lib/posthog';

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const posthog = usePostHog();

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedLanguageId) {
      const selectedLanguage = languages.find(lang => lang.id === selectedLanguageId);
      if (selectedLanguage) {
        posthog.capture('language_selected', {
          language_code: selectedLanguage.id,
          language_name: selectedLanguage.name,
        });
      }
      router.replace("/" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface"
        >
          <Ionicons name="chevron-back" size={24} color="#0D132B" />
        </TouchableOpacity>
        <Text className="h3 flex-1 text-center mr-10">Choose a language</Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-6">
        <View className="flex-row items-center bg-surface px-4 py-3 rounded-full border border-border">
          <Ionicons name="search-outline" size={20} color="#6B7280" className="mr-2" />
          <TextInput
            placeholder="Search languages"
            placeholderTextColor="#6B7280"
            className="flex-1 body-md text-text-primary"
            style={{
              height: 40,
              paddingVertical: 0,
              textAlignVertical: 'center'
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="h4 mb-4">Popular</Text>

        {filteredLanguages.map((lang) => (
          <LanguageCard
            key={lang.id}
            language={lang}
            isSelected={selectedLanguageId === lang.id}
            onSelect={setSelectedLanguageId}
          />
        ))}

        {/* Spacer for earth image if not fixed */}
        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Earth Illustration and Button */}
      <View style={styles.bottomContainer}>
        <View style={{ width: '100%', overflow: 'hidden' }}>
          <Image
            source={images.earth}
            style={styles.earthImage}
            resizeMode="cover"
          />
        </View>

        <View className="px-6 pb-8 pt-4 bg-white">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selectedLanguageId}
            className={`w-full py-4 rounded-full items-center shadow-button ${selectedLanguageId ? 'bg-purple' : 'bg-border'
              }`}
          >
            <Text className="font-poppins-bold text-white text-lg">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  earthImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  }
});
