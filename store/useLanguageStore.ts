import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface LanguageState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const secureStorageAdapter = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
