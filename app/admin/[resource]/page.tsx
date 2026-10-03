import { notFound } from 'next/navigation'
import ResourceManager from '@/components/admin/resource-manager'
import { getAdminRows, getResourceOptions } from '@/lib/admin/data'
import { isResourceKey } from '@/lib/admin/resources'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ resource: string }> }

export default async function AdminResourcePage({ params }: Props) {
  const { resource } = await params
  if (!isResourceKey(resource)) notFound()

  const [rows, options] = await Promise.all([getAdminRows(resource), getResourceOptions()])
  return <ResourceManager resource={resource} rows={rows} options={options} />
}
