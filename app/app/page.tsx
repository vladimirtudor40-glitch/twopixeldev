import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';
import './dashboard.css';

export const metadata: Metadata = { title: 'twopixeldev // control' };

export default function AppPage() {
  return <Dashboard />;
}
