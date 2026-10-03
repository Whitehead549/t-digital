import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/dashboard-shell'
import CertificatesPanel from '@/components/dashboard/certificates-panel'
import { student } from '@/lib/data/dashboard'
import { getStudentCertificates } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Certificates — TORVAN',
  description: 'View and download the certificates you have earned on TORVAN.',
  robots: { index: false, follow: false },
}

export default async function CertificatesPage() {
  const certificates = await getStudentCertificates(student.email)
  return (
    <DashboardShell>
      <section className="sd-welcome" aria-labelledby="certificates-page-title">
        <div>
          <h1 id="certificates-page-title">My Certificates</h1>
          <p>Certificates are issued by the TORVAN team once you complete a course. New ones appear here automatically.</p>
        </div>
      </section>

      <CertificatesPanel certificates={certificates} />
    </DashboardShell>
  )
}
