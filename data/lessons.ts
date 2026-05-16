import { Lesson } from '../types/learning';

export const lessons: Lesson[] = [
  {
    id: 'lesson-es-1-1',
    unitId: 'unit-es-1',
    order: 1,
    title: 'Greetings',
    description: 'Learn how to say hello and good morning in Spanish.',
    goal: 'Learn basic Spanish greetings: "Hola" and "Buenos días".',
    aiTeacherPrompt: 'You are a helpful Spanish teacher. Today you are teaching basic greetings. Encourage the student to practice "Hola" (Hello) and "Buenos días" (Good morning). Keep it simple and friendly.',
    activities: [
      {
        id: 'act-es-1-1-1',
        type: 'vocabulary',
        prompt: 'Translate "Hello" to Spanish',
        expectedAnswer: 'Hola',
        options: ['Hola', 'Adiós', 'Gracias'],
        vocabulary: {
          id: 'voc-es-hola',
          word: 'Hola',
          translation: 'Hello',
        },
      },
      {
        id: 'act-es-1-1-2',
        type: 'phrase',
        prompt: 'How do you say "Good morning" in Spanish?',
        expectedAnswer: 'Buenos días',
        phrase: {
          id: 'phr-es-buenos-dias',
          phrase: 'Buenos días',
          translation: 'Good morning',
        },
      },
    ],
  },
  {
    id: 'lesson-fr-1-1',
    unitId: 'unit-fr-1',
    order: 1,
    title: 'Greetings',
    description: 'Learn how to say hello and good morning in French.',
    goal: 'Learn basic French greetings: "Bonjour" and "Salut".',
    aiTeacherPrompt: 'You are a charming French teacher. Teach the student "Bonjour" (Hello/Good morning) and "Salut" (Hi). Explain when to use each one.',
    activities: [
      {
        id: 'act-fr-1-1-1',
        type: 'vocabulary',
        prompt: 'Translate "Hello" to French',
        expectedAnswer: 'Bonjour',
        options: ['Bonjour', 'Merci', 'Au revoir'],
        vocabulary: {
          id: 'voc-fr-bonjour',
          word: 'Bonjour',
          translation: 'Hello',
        },
      },
      {
        id: 'act-fr-1-1-2',
        type: 'phrase',
        prompt: 'Translate "Hi" (informal) to French',
        expectedAnswer: 'Salut',
        phrase: {
          id: 'phr-fr-salut',
          phrase: 'Salut',
          translation: 'Hi',
        },
      },
    ],
  },
];
