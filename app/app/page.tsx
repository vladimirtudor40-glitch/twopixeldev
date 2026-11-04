import type { Metadata } from 'next';
import Dashboard from '@/components/Dashboard';
import { displaySoft } from '../fonts';
import './dashboard.css';

export const metadata: Metadata = {
  title: 'twopixeldev // crm',
  robots: { index: false, follow: false },
};

export default function AppPage() {
  return <div className={displaySoft.variable}><Dashboard /></div>;
}
