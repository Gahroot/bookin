import { PageHeader } from '@/components/Section'
import { pageMetadata } from '@/lib/seo'
import { OWNER_EMAIL } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Privacy policy',
  description:
    'How nolangrout.com handles analytics and leads: no cookies, no IP storage, and booking details shared only with the CRM and scheduling tools needed to follow up.',
  path: '/privacy',
  ogKey: 'page/privacy',
})

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy"
        intro="Plain language. Last updated October 27, 2026."
      />
      <div className="rail prose mt-10 max-w-3xl">
        <h2>Analytics without cookies</h2>
        <p>
          This site sets no cookies. To understand which pages are useful, it sends small anonymous
          events (a page view, a click on a call-to-action, a demo run) with the page path, the
          referring site and any campaign tags in the link. IP addresses are not stored and events
          are not tied to a person.
        </p>
        <p>
          To credit how you found the site, your browser’s local storage keeps a note of the first
          and the latest campaign or referring site (key <code>ng_attr</code>). It never leaves your
          device unless you submit the booking form. Clear your site data to remove it. Your theme
          choice is stored the same way.
        </p>
        <h2>When you book a call</h2>
        <p>
          The booking form asks for your name, email, phone, company and a few questions about your
          project. On submit, those answers and the attribution note are sent to my CRM and to my
          site engine so I can prepare for the call and follow up. They are not sold or shared with
          anyone else. Scheduling is handled by Cal.com under its own privacy policy.
        </p>
        <h2>Your choices</h2>
        <p>
          Email <a href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</a> to see, correct or delete what I
          hold about you.
        </p>
      </div>
    </>
  )
}
