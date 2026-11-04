import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { site } from '@/site.config';

export const metadata: Metadata = {
  title: 'Privacy policy | twopixeldev',
  description: 'What personal data twopixeldev.com processes and what your rights are.',
  alternates: { canonical: '/en/privacy/', languages: { ro: '/confidentialitate/', en: '/en/privacy/' } },
};

export default function PrivacyEn() {
  const [v, e] = site.contacts;
  return (
    <LegalPage lang="en" page="privacy" title="Privacy policy">
      <h2>Who we are</h2>
      <p>
        twopixeldev.com is the website of the twopixeldev studio, run by {v.name} and {e.name}. For any question about your
        data, write to us at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>What data we process</h2>
      <ul>
        <li><strong>Emails and WhatsApp messages you send us.</strong> We use them only to reply and to work on the project we discuss.</li>
        <li><strong>Technical visit data.</strong> Our hosting provider, Cloudflare, processes your IP address and browser information to deliver the pages and block attacks.</li>
      </ul>
      <p>We never sell data.</p>

      <h2 id="cookies">Cookies and browser storage</h2>
      <p>
        We only use items that are strictly necessary for the site to work and stay secure. We use no advertising, analytics or
        tracking cookies, so no consent is needed for them.
      </p>
      <ul>
        <li><strong>__cf_bm</strong> (Cloudflare, up to 30 minutes): may be set by our hosting provider to tell real visitors apart from bots.</li>
        <li><strong>tpd_session</strong> (up to 30 days): sign-in cookie, set only for team members who log in to the internal area.</li>
        <li><strong>tpd-theme</strong> (local storage): remembers the light or dark theme, if you chose one.</li>
        <li><strong>tpd-cookie-notice</strong> (local storage): remembers that you closed the cookie notice.</li>
      </ul>
      <p>You can delete them at any time in your browser settings. The site will keep working.</p>

      <h2>Why, and on what legal basis</h2>
      <p>
        We answer messages to take steps at your request before entering into a contract, or on the basis of our legitimate
        interest in communicating with people who contact us (Art. 6(1)(b) and (f) GDPR). Technical data is processed on the
        basis of our legitimate interest in keeping the site secure and working.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep correspondence for as long as we work together and for at most 3 years after the last contact, then delete it,
        unless the law requires us to keep it longer (for example, accounting records).
      </p>

      <h2>Who else has access</h2>
      <p>
        We use Cloudflare for hosting and protection, Namecheap Private Email for email and WhatsApp for messages. They process
        data only to provide these services to us.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, rectify or erase your data, to restrict or object to its processing and to data
        portability. Write to us and we will reply within one month. You can also lodge a complaint with the Romanian data
        protection authority, ANSPDCP (<a href="https://www.dataprotection.ro" rel="noopener">dataprotection.ro</a>), or with the
        authority in your own country.
      </p>
    </LegalPage>
  );
}
