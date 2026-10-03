export type Stat = { value: string; label: string }
export type Feature = { title: string; description: string }
export type FooterColumn = { title: string; links: string[] }


export const heroStats: Stat[] = [
  { value: '10,000+', label: 'Online Courses' },
  { value: '50,000+', label: 'Active Learners' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '4.8/5', label: 'Average Rating' },
]

export const promoBanner = { tag: 'Special Offer', text: 'Get 20% Off Premium Membership.', linkLabel: 'Learn more' }

export const premium = {
  eyebrow: 'GO PREMIUM',
  title: 'Unlock unlimited learning',
  description: 'Get unlimited access to premium courses, certificates, and exclusive resources.',
  ctaLabel: 'Upgrade Now',
  perks: ['Unlimited Access', 'Premium Courses', 'Certificates', 'Exclusive Resources'],
}

export const whyLearnFeatures: Feature[] = [
  { title: 'Flexible Learning', description: 'Learn at your own pace, anytime and anywhere.' },
  { title: 'Certified Courses', description: 'Earn certificates that are recognized by employers.' },
  { title: 'Expert Instructors', description: 'Learn directly from the best in every field.' },
  { title: 'Career Support', description: 'Get job-ready with dedicated career guidance.' },
]

export const footerColumns: FooterColumn[] = [
  { title: 'Quick Links', links: ['Home', 'Courses', 'Categories', 'Bundles', 'About', 'Career'] },
  { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQ', 'Terms & Privacy'] },
]

export const footerTagline = 'Learn today. Lead tomorrow.'
