export type Category = {
  id: string
  name: string
  description: string
  image: string
  courseCount: number
}

export const categories: Category[] = [
  { id: 'web-development', name: 'Web Development', description: 'Build modern websites and applications from the ground up.', image: '/images/hero-learner.png', courseCount: 24 },
  { id: 'mobile-development', name: 'Mobile Development', description: 'Create intuitive apps for iOS and Android devices.', image: '/images/hero-learner.png', courseCount: 16 },
  { id: 'ui-ux-design', name: 'UI/UX Design', description: 'Design thoughtful digital experiences people love to use.', image: '/images/hero-learner.png', courseCount: 18 },
  { id: 'data-science', name: 'Data Science', description: 'Turn data into useful decisions, insights, and products.', image: '/images/hero-learner.png', courseCount: 21 },
  { id: 'digital-marketing', name: 'Digital Marketing', description: 'Grow audiences with practical marketing skills and strategy.', image: '/images/hero-learner.png', courseCount: 14 },
  { id: 'business', name: 'Business', description: 'Develop the skills to lead teams and build better businesses.', image: '/images/hero-learner.png', courseCount: 12 },
  { id: 'photography', name: 'Photography', description: 'Learn to capture compelling stories through your lens.', image: '/images/hero-learner.png', courseCount: 10 },
  { id: 'cybersecurity', name: 'Cybersecurity', description: 'Protect systems, data, and people in a connected world.', image: '/images/hero-learner.png', courseCount: 9 },
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', description: 'Use AI tools, prompts, and automation to work smarter.', image: '/images/hero-learner.png', courseCount: 15 },
  { id: 'virtual-assistance', name: 'Virtual Assistance', description: 'Support clients remotely with in-demand admin skills.', image: '/images/hero-learner.png', courseCount: 8 },
  { id: 'content-creation', name: 'Content Creation', description: 'Create engaging content and grow an audience online.', image: '/images/hero-learner.png', courseCount: 11 },
  { id: 'mobile-skill-acquisition-course', name: 'Mobile Skill Acquisition Course', description: 'Learn creative, money-making skills using only your phone.', image: '/images/hero-learner.png', courseCount: 7 },
]

export function getCategory(categoryId: string) {
  return categories.find((category) => category.id === categoryId)
}

export function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export const siteContent = {
  brand: 'TORVAN',
  heroEyebrow: 'LEARN. GROW. SUCCEED.',
  heroTitle: 'Choose from a variety of courses and learning path',
  heroDescription: 'Master new skills with practical courses built for your next opportunity.',
  featuredEyebrow: 'FEATURED COURSES',
  featuredTitle: 'Learn from the best',
}

export const navigation = { exploreLabel: 'Explore', searchPlaceholder: 'Search for a course', getStartedLabel: 'Get Started' }

export const categoryNames = categories.map((category) => category.name)
