import { PAGES } from '../config/pages.config';

export interface IMenuItem {
  href: string;
  name: string;
}

export const MENU_ITEMS = [
  {
    href: PAGES.HOME,
    name: 'Home',
  },
  {
    href: PAGES.EXPLORE,
    name: 'Explore',
  },
  {
    href: PAGES.PROFILE_FAKE,
    name: 'Profile',
  },
];
