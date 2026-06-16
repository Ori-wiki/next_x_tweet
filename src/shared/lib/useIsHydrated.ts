'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onStoreChange: () => void) => {
  const timeoutId = window.setTimeout(onStoreChange, 0);

  return () => window.clearTimeout(timeoutId);
};

const getClientSnapshot = () => true;

const getServerSnapshot = () => false;

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
