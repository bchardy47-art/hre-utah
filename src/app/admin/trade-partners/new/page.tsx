import { Card, PageHead } from '@/components/portal/ui'
import InviteForm from './InviteForm'

export const dynamic = 'force-dynamic'

export default function NewTradePartnerPage() {
  return (
    <>
      <PageHead
        eyebrow="Administration"
        title="Add trade partner"
        subtitle="Sends a secure, single-use invitation. The company creates its own account and completes the application from there."
      />

      <div className="pt-grid pt-grid-side">
        <Card title="Invitation details">
          <InviteForm />
        </Card>

        <Card title="What happens next">
          <ol style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8, fontSize: 14.5 }}>
            <li>An invitation email goes out with a secure link.</li>
            <li>The link expires and works only once.</li>
            <li>They create a password and complete the application.</li>
            <li>You review the application and each document.</li>
            <li>You approve them to bid, then to work.</li>
          </ol>
          <p className="pt-hint">
            You can resend, revoke, or copy the link at any time from the company&rsquo;s profile.
          </p>
        </Card>
      </div>
    </>
  )
}
