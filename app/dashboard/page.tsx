import DashboardShell from '@/components/dashboard/dashboard-shell'
import DashboardView from '@/components/dashboard/dashboard-view'
import { student } from '@/lib/data/dashboard'
import { getStudentCertificates } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const certificates = await getStudentCertificates(student.email)
  return (
    <DashboardShell>
      <DashboardView certificateCount={certificates.length} />
    </DashboardShell>
  )
}
