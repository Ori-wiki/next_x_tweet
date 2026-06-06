import { PropsWithChildren } from 'react';
import { AppShell } from '@/widgets/app-shell';

export default function Layout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
