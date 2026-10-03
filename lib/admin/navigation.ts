import { Archive, Award, BookOpen, Crown, FolderTree, LayoutDashboard, MessageSquareQuote, ShoppingBag, Star, type LucideIcon } from 'lucide-react'

export type AdminNavItem = { label: string; href: string; icon: LucideIcon }

export const adminNavGroups: { label: string; items: AdminNavItem[] }[] = [
  { label: 'General', items: [{ label: 'Overview', href: '/admin', icon: LayoutDashboard }] },
  {
    label: 'Catalog',
    items: [
      { label: 'Courses', href: '/admin/courses', icon: BookOpen },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Bundles', href: '/admin/bundles', icon: Archive },
      { label: 'Premium', href: '/admin/premium', icon: Crown },
    ],
  },
  { label: 'Sales', items: [{ label: 'Orders', href: '/admin/orders', icon: ShoppingBag }] },
  { label: 'Students', items: [{ label: 'Certificates', href: '/admin/certificates', icon: Award }] },
  {
    label: 'Community',
    items: [
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
]

export const adminNavItems = adminNavGroups.flatMap((group) => group.items)

export function findNavItem(pathname: string) {
  return adminNavItems.find((item) => (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href))) ?? adminNavItems[0]
}
