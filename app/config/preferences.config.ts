import type {
  UserDensity,
  UserLanguage,
  UserTheme,
} from '@/app/shared/types/user.interface';

export interface PreferenceOption<T extends string> {
  label: string;
  value: T;
}

export const THEME_OPTIONS: PreferenceOption<UserTheme>[] = [
  { value: 'midnight', label: 'Midnight' },
  { value: 'dawn', label: 'Dawn' },
];

export const DENSITY_OPTIONS: PreferenceOption<UserDensity>[] = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

export const LANGUAGE_OPTIONS: PreferenceOption<UserLanguage>[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
];

export const DEFAULT_USER_SETTINGS = {
  theme: 'midnight' as const,
  density: 'comfortable' as const,
  language: 'en' as const,
};

export const ALLOWED_THEMES = new Set(THEME_OPTIONS.map(({ value }) => value));
export const ALLOWED_DENSITIES = new Set(
  DENSITY_OPTIONS.map(({ value }) => value),
);
export const ALLOWED_LANGUAGES = new Set(
  LANGUAGE_OPTIONS.map(({ value }) => value),
);
