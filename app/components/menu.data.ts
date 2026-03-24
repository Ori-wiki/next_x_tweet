import { PAGES } from '../config/pages.config';

export interface MenuItemData {
  href: string;
  name: string;
}

export const MENU_ITEMS: MenuItemData[] = [
  { href: PAGES.HOME, name: 'Home' },
  { href: PAGES.EXPLORE, name: 'Explore' },
  { href: PAGES.PROFILE_FAKE, name: 'Dashboard' },
  { href: PAGES.SHOP, name: 'Shop' },
];
