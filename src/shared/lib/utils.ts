import type { Language } from '@/shared/config/language';

const locales: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
};

export function formatDateTime(
  dateString: string,
  language: Language = 'en',
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locales[language], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatNumber(value: number, language: Language = 'en') {
  return new Intl.NumberFormat(locales[language]).format(value);
}
