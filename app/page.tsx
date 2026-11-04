import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { ro: '/', en: '/en/', 'x-default': '/' } },
};

export default function Home() {
  return <HomePage lang="ro" />;
}
