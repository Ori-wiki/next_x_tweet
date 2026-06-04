import { getDictionary } from '@/app/shared/lib/i18n';
import type { UserLanguage } from '@/app/shared/types/user.interface';
import { PAGES } from '../config/pages.config';

export interface MenuItemData {
  href: string;
  name: string;
}

export function getMenuItems(language?: UserLanguage): MenuItemData[] {
  const { common } = getDictionary(language);

  return [
    { href: PAGES.HOME, name: common.home },
    { href: PAGES.EXPLORE, name: common.explore },
    { href: PAGES.PROFILE_FAKE, name: common.dashboard },
    { href: PAGES.NOTIFICATIONS, name: common.notifications },
  ];
}
