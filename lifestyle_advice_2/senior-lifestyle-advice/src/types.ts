export type Language = 'en' | 'ko';

export interface Advice {
  id: string;
  category: 'walking' | 'water' | 'posture' | 'social' | 'general';
  text: string;
  subtext: string;
  highlight: string;
}

export interface Translation {
  title: string;
  greeting: string;
  suggestions: string;
  home: string;
  advice: string;
  profile: string;
  refresh: string;
  language: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    title: 'Lifestyle Advice',
    greeting: 'Hello there!',
    suggestions: "Today's Suggestions",
    home: 'Home',
    advice: 'Advice',
    profile: 'Profile',
    refresh: 'Refresh Advice',
    language: 'EN/KO',
  },
  ko: {
    title: '생활 조언',
    greeting: '안녕하세요!',
    suggestions: '오늘의 추천',
    home: '홈',
    advice: '조언',
    profile: '프로필',
    refresh: '조언 새로고침',
    language: 'KO/EN',
  },
};
