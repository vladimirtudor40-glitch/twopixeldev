import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { site } from '@/site.config';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t.en.title,
  description: t.en.description,
  alternates: { canonical: '/en/', languages: { ro: '/', en: '/en/', 'x-default': '/' } },
  openGraph: { type: 'website', locale: 'en_US', url: `${site.url}/en/`, siteName: site.name, title: t.en.title, description: t.en.description },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
