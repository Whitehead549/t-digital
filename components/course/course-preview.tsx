import { Play } from 'lucide-react'

export default function CoursePreview({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--ink)]">
      <img src={image} alt={`Preview of ${title}`} className="size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden="true" />
      <button
        type="button"
        aria-label={`Play preview for ${title}`}
        className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--brand)] text-white shadow-[0_0_0_8px_rgba(214,0,28,.25)] transition-transform hover:scale-105"
      >
        <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
      </button>
    </div>
  )
}
