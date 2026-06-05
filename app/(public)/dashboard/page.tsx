import { Metadata } from 'next';
import { Dashboard } from './Dashboard';

export const metadata: Metadata = {
  title: 'Private Dashboard',
};

export default function DashboardPage() {
  return <Dashboard />;
}
