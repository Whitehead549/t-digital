export const resourceKeys = ['courses', 'categories', 'bundles', 'premium', 'orders', 'reviews', 'testimonials'] as const
export type ResourceKey = (typeof resourceKeys)[number]

export function isResourceKey(value: string): value is ResourceKey {
  return (resourceKeys as readonly string[]).includes(value)
}

export type AdminRow = Record<string, string | number | boolean | string[] | null> & { id: string | number }
export type SelectOption = { value: string; label: string }
export type ResourceOptions = { categories: SelectOption[]; courses: SelectOption[] }

export const publishStatuses = ['published', 'draft'] as const
export const courseTones = ['blue', 'cyan', 'purple', 'pink'] as const
export const orderStatuses = ['pending', 'paid', 'refunded', 'cancelled'] as const
export const orderItemTypes = ['course', 'bundle', 'premium'] as const
export const reviewStatuses = ['approved', 'pending', 'hidden'] as const
export const planSuffixes = ['/month', '/year', 'one-time'] as const
