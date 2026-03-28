import type { UserLanguage } from '@/app/shared/types/user.interface';

export interface PreferenceOption<T extends string> {
  label: string;
  value: T;
}

export const LANGUAGE_OPTIONS: PreferenceOption<UserLanguage>[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
];

export const DEFAULT_USER_SETTINGS = {
  language: 'en' as const,
};
export const ALLOWED_LANGUAGES = new Set(
  LANGUAGE_OPTIONS.map(({ value }) => value),
);
