import { getDictionary } from '@/src/shared/lib/i18n';
import type { UserLanguage } from '@/src/entities/user/model/types';
import { PAGES } from '@/src/shared/config/pages';

export interface MenuItemData {
  href: string;
  name: string;
}

export function getMenuItems(language?: UserLanguage): MenuItemData[] {
  const { common } = getDictionary(language);

  return [
    { href: PAGES.HOME, name: common.home },
    { href: PAGES.EXPLORE, name: common.explore },
    { href: PAGES.DASHBOARD, name: common.dashboard },
    { href: PAGES.NOTIFICATIONS, name: common.notifications },
  ];
}
