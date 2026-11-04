import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { site } from '@/site.config';

export const metadata: Metadata = {
  title: 'Terms of use | twopixeldev',
  description: 'The terms for using twopixeldev.com.',
  alternates: { canonical: '/en/terms/', languages: { ro: '/termeni/', en: '/en/terms/' } },
};

export default function TermsEn() {
  return (
    <LegalPage lang="en" page="terms" title="Terms of use">
      <h2>About this site</h2>
      <p>
        twopixeldev.com presents the services of the twopixeldev studio. The information here is indicative and is not a
        binding offer. Price, timeline and deliverables for each project are agreed separately, in writing, before work starts.
      </p>

      <h2>Internal area</h2>
      <p>Parts of this site are reserved for the twopixeldev team. Unauthorised access attempts are prohibited and may be blocked.</p>

      <h2>Intellectual property</h2>
      <p>
        The logo, animation and texts on this site belong to twopixeldev. You may not copy or use them commercially without our
        written consent.
      </p>

      <h2>Liability</h2>
      <p>
        We do our best to keep the site available and its information accurate, but we cannot guarantee uninterrupted
        operation. Links to other sites are provided for convenience only.
      </p>

      <h2>Personal data</h2>
      <p>How we use your data is explained in our <a href="/en/privacy/">Privacy policy</a>.</p>

      <h2>Governing law and contact</h2>
      <p>
        These terms are governed by Romanian law. For questions, write to us at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
