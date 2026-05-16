export type Language = {
  id: string;
  name: string;
  flagEmoji: string;
  description: string;
  learnerCount: string;
};

export type Unit = {
  id: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
};

export type ActivityType = 'vocabulary' | 'phrase' | 'chat' | 'audio' | 'video';

export type Vocabulary = {
  id: string;
  word: string;
  translation: string;
  audioUrl?: string;
  imageUrl?: string;
};

export type Phrase = {
  id: string;
  phrase: string;
  translation: string;
  audioUrl?: string;
};

export type Activity = {
  id: string;
  type: ActivityType;
  prompt: string;
  expectedAnswer?: string;
  options?: string[];
  vocabulary?: Vocabulary;
  phrase?: Phrase;
};

export type Lesson = {
  id: string;
  unitId: string;
  order: number;
  title: string;
  description: string;
  goal: string;
  aiTeacherPrompt: string;
  activities: Activity[];
  imageUrl?: string;
};
