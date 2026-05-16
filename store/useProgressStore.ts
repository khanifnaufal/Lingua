import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface ProgressState {
  completedLessonIds: string[];
  activeLessonId: string | null;
  completeLesson: (id: string) => void;
  setActiveLesson: (id: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const secureStorageAdapter = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessonIds: ['lesson-es-1-1', 'lesson-es-1-2'],
      activeLessonId: 'lesson-es-1-3',
      completeLesson: (id) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(id)
            ? state.completedLessonIds
            : [...state.completedLessonIds, id],
        })),
      setActiveLesson: (id) => set({ activeLessonId: id }),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => secureStorageAdapter),
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      },
    }
  )
);
