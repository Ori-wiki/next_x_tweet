import { PropsWithChildren } from 'react';
import { AppShell } from '@/src/widgets/app-shell';

export default function Layout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
