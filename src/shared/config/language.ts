import type {
  DatabaseUserLanguage,
  DatabaseUserSettings,
} from '@/shared/db';

export type Language = DatabaseUserLanguage;
export type LanguageSettings = DatabaseUserSettings;

export interface LanguageOption<T extends string> {
  label: string;
  value: T;
}

export const LANGUAGE_OPTIONS: LanguageOption<Language>[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
];

export const DEFAULT_USER_SETTINGS: LanguageSettings = {
  language: 'en',
};

export const ALLOWED_LANGUAGES = new Set(
  LANGUAGE_OPTIONS.map(({ value }) => value),
);
