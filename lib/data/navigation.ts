export type NavLink = {
  label: string
  href: string
  /** Route pathname that marks this link as the current page. */
  activePath?: string
}

export const primaryNavLinks: NavLink[] = [
  { label: 'Home', href: '/', activePath: '/' },
  { label: 'Courses', href: '/courses', activePath: '/courses' },
  { label: 'Categories', href: '/categories', activePath: '/categories' },
  { label: 'Bundles', href: '/bundles', activePath: '/bundles' },
  { label: 'Career', href: '/' },
  { label: 'Premium', href: '/premium', activePath: '/premium' },
  { label: 'Blog', href: '/' },
  { label: 'About', href: '/' },
]

export const authLinks = {
  login: { label: 'Login', href: '/' },
  register: { label: 'Register' },
}

export function isNavLinkActive(link: NavLink, pathname: string) {
  if (!link.activePath) return false
  if (link.activePath === '/') return pathname === '/'
  return pathname === link.activePath || pathname.startsWith(`${link.activePath}/`)
}
