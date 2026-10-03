'use client'

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Clapperboard, ImagePlus, Link2, Pause, Play, RefreshCw, Trash2, UploadCloud, UserRound, X } from 'lucide-react'
import type { VideoAsset } from '@/lib/admin/resources'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024

export function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export function formatDuration(seconds: number) {
  if (!seconds || !Number.isFinite(seconds)) return '0:00'
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

function useDropzone(onFiles: (files: File[]) => void) {
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  return {
    dragging,
    handlers: {
      onDragEnter: (event: DragEvent) => { event.preventDefault(); depth.current += 1; setDragging(true) },
      onDragOver: (event: DragEvent) => event.preventDefault(),
      onDragLeave: (event: DragEvent) => { event.preventDefault(); depth.current -= 1; if (depth.current <= 0) setDragging(false) },
      onDrop: (event: DragEvent) => {
        event.preventDefault()
        depth.current = 0
        setDragging(false)
        onFiles(Array.from(event.dataTransfer.files))
      },
    },
  }
}

function Dropzone({ id, accept, multiple, onFiles, icon, title, hint, compact }: { id: string; accept: string; multiple?: boolean; onFiles: (files: File[]) => void; icon: ReactNode; title: ReactNode; hint: string; compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { dragging, handlers } = useDropzone(onFiles)
  return (
    <div
      className={`admin-dropzone${dragging ? ' dragging' : ''}${compact ? ' compact' : ''}`}
      {...handlers}
      onClick={() => inputRef.current?.click()}
    >
      <span className="admin-dropzone-icon" aria-hidden="true">{icon}</span>
      <div className="admin-dropzone-copy">
        <b>{dragging ? 'Drop to upload' : title}</b>
        <small>{hint}</small>
      </div>
      <button type="button" className="admin-dropzone-browse" onClick={(event) => { event.stopPropagation(); inputRef.current?.click() }}>
        Browse files
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
    </div>
  )
}

const DOCUMENT_INLINE_BYTES = 1.5 * 1024 * 1024
const DOCUMENT_MAX_SIDE = 2400

const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

// Documents (e.g. certificates) must be viewable by other users, so they are stored as data URLs instead of
// tab-local blob URLs. Large files are downscaled to keep the saved payload within the server action limit.
async function encodeDocumentImage(file: File) {
  if (file.size <= DOCUMENT_INLINE_BYTES) return readAsDataUrl(file)
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, DOCUMENT_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.9)
}

export function ImageUpload({
  name,
  label,
  hint,
  value,
  onChange,
  variant = 'thumbnail',
  autoFocus,
}: {
  name: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  variant?: 'thumbnail' | 'avatar' | 'document'
  autoFocus?: boolean
}) {
  const [error, setError] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null)
  const replaceRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const isAvatar = variant === 'avatar'

  useEffect(() => {
    if (autoFocus) fieldRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [autoFocus])

  const isDocument = variant === 'document'

  const accept = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please choose an image file (PNG, JPG, WebP or GIF).')
    if (file.size > MAX_IMAGE_BYTES) return setError(`Image is ${formatBytes(file.size)}. The maximum is 5 MB.`)
    setError('')
    setFileMeta({ name: file.name, size: file.size })
    if (!isDocument) return onChange(URL.createObjectURL(file))
    try {
      onChange(await encodeDocumentImage(file))
    } catch {
      setFileMeta(null)
      setError('Could not read that image. Please try a different PNG or JPG file.')
    }
  }

  return (
    <div ref={fieldRef} className={`admin-field admin-media-field${isAvatar ? ' is-avatar' : ''}`}>
      <div className="admin-media-head">
        <span className="admin-field-label" id={`${name}-label`}>{label}</span>
        <button type="button" className="admin-link-button" onClick={() => setShowUrl((open) => !open)} aria-expanded={showUrl}>
          <Link2 size={13} aria-hidden="true" /> {showUrl ? 'Hide URL' : 'Use image URL'}
        </button>
      </div>

      {value ? (
        <div className="admin-image-preview">
          <img src={value} alt={`${label} preview`} crossOrigin={value.startsWith('http') ? 'anonymous' : undefined} />
          <div className="admin-image-preview-bar">
            <span className="admin-image-preview-meta">
              <b>{fileMeta?.name ?? (value.startsWith('blob:') || value.startsWith('data:') ? 'Uploaded image' : value.split('/').pop())}</b>
              {fileMeta && <small>{formatBytes(fileMeta.size)}</small>}
            </span>
            <span className="admin-image-preview-actions">
              <button type="button" onClick={() => replaceRef.current?.click()}><RefreshCw size={14} aria-hidden="true" /> Replace</button>
              <button type="button" className="danger" onClick={() => { setFileMeta(null); onChange('') }} aria-label={`Remove ${label.toLowerCase()}`}><Trash2 size={14} aria-hidden="true" /></button>
            </span>
          </div>
          <input ref={replaceRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => { accept(Array.from(event.target.files ?? [])); event.target.value = '' }} />
        </div>
      ) : (
        <Dropzone
          id={`${name}-input`}
          accept="image/*"
          onFiles={accept}
          icon={isAvatar ? <UserRound size={22} /> : <ImagePlus size={22} />}
          title={<>Drag & drop a {isAvatar ? 'profile picture' : isDocument ? 'certificate image' : 'thumbnail'}, or <u>click to upload</u></>}
          hint={isDocument ? 'PNG or JPG · landscape recommended · up to 5 MB' : `PNG, JPG, WebP or GIF · ${isAvatar ? 'square' : '16:9'} recommended · up to 5 MB`}
        />
      )}

      {showUrl && (
        <input
          type="url"
          aria-labelledby={`${name}-label`}
          placeholder={isAvatar ? 'https://example.com/profile.jpg' : 'https://example.com/thumbnail.jpg'}
          value={value.startsWith('blob:') || value.startsWith('data:') ? '' : value}
          onChange={(event) => { setFileMeta(null); onChange(event.target.value) }}
        />
      )}
      {error ? <p className="admin-media-error" role="alert">{error}</p> : hint ? <small>{hint}</small> : null}
    </div>
  )
}

function readVideo(file: File): Promise<{ duration: number; thumbnail: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    let duration = 0
    const done = (thumbnail = '') => {
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(url)
      resolve({ duration, thumbnail })
    }
    video.onloadedmetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0
      video.currentTime = Math.min(1, duration / 4 || 0)
    }
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        const width = 320
        canvas.width = width
        canvas.height = Math.round((video.videoHeight / video.videoWidth) * width) || 180
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
        done(canvas.toDataURL('image/jpeg', 0.72))
      } catch {
        done()
      }
    }
    video.onerror = () => done()
    window.setTimeout(() => done(), 8000)
    video.src = url
  })
}

const titleFromFile = (fileName: string) => fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

export function VideoUpload({
  name,
  label,
  hint,
  value,
  onChange,
  onUploadingChange,
  autoFocus,
}: {
  name: string
  label: string
  hint?: string
  value: VideoAsset[]
  onChange: (value: VideoAsset[]) => void
  onUploadingChange: (uploading: boolean) => void
  autoFocus?: boolean
}) {
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [paused, setPaused] = useState<Record<string, boolean>>({})
  const [playing, setPlaying] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const fieldRef = useRef<HTMLDivElement>(null)
  const latest = useRef(value)
  latest.current = value
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const uploading = Object.values(progress).some((percent) => percent < 100)
  useEffect(() => onUploadingChange(uploading), [uploading, onUploadingChange])

  useEffect(() => {
    if (autoFocus) fieldRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [autoFocus])

  const update = (id: string, patch: Partial<VideoAsset>) => onChange(latest.current.map((video) => (video.id === id ? { ...video, ...patch } : video)))

  // Upload progress is simulated client-side; replace with a real upload when a storage backend is connected.
  const simulateUpload = (id: string, size: number) => {
    const step = Math.max(2, Math.min(18, 2_000_000_000 / Math.max(size, 1) / 40))
    const tick = () => {
      setProgress((current) => {
        if (!(id in current)) return current
        if (pausedRef.current[id]) {
          window.setTimeout(tick, 250)
          return current
        }
        const next = Math.min(100, current[id] + step * (0.6 + Math.random() * 0.8))
        if (next < 100) window.setTimeout(tick, 220)
        return { ...current, [id]: next }
      })
    }
    window.setTimeout(tick, 220)
  }

  const addFiles = async (files: File[]) => {
    const problems: string[] = []
    const valid = files.filter((file) => {
      if (!file.type.startsWith('video/')) { problems.push(`${file.name} is not a video file.`); return false }
      if (file.size > MAX_VIDEO_BYTES) { problems.push(`${file.name} is larger than 2 GB.`); return false }
      return true
    })
    setErrors(problems)
    if (!valid.length) return

    const added: VideoAsset[] = valid.map((file) => ({
      id: crypto.randomUUID(),
      title: titleFromFile(file.name) || 'Untitled video',
      fileName: file.name,
      size: file.size,
      duration: 0,
      url: URL.createObjectURL(file),
      thumbnail: '',
    }))
    onChange([...latest.current, ...added])
    setProgress((current) => ({ ...current, ...Object.fromEntries(added.map((video) => [video.id, 0])) }))
    added.forEach((video) => simulateUpload(video.id, video.size))

    await Promise.all(valid.map(async (file, index) => {
      const meta = await readVideo(file)
      const video = added[index]
      const existing = latest.current.find((item) => item.id === video.id)
      if (existing) update(video.id, { duration: meta.duration, thumbnail: existing.thumbnail || meta.thumbnail })
    }))
  }

  const remove = (id: string) => {
    onChange(latest.current.filter((video) => video.id !== id))
    setProgress(({ [id]: _removed, ...rest }) => rest)
    if (playing === id) setPlaying(null)
  }

  const move = (index: number, direction: -1 | 1) => {
    const next = [...latest.current]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const totalDuration = value.reduce((sum, video) => sum + video.duration, 0)

  return (
    <div className="admin-field admin-media-field" ref={fieldRef}>
      <div className="admin-media-head">
        <span className="admin-field-label">{label}</span>
        <small className="admin-media-count">
          {value.length} {value.length === 1 ? 'video' : 'videos'}
          {totalDuration > 0 && <> · {formatDuration(totalDuration)}</>}
        </small>
      </div>

      <Dropzone
        id={`${name}-input`}
        accept="video/*"
        multiple
        onFiles={addFiles}
        compact={value.length > 0}
        icon={<UploadCloud size={22} />}
        title={value.length ? <>Add more videos — drop here or <u>browse</u></> : <>Drag & drop videos, or <u>click to upload</u></>}
        hint="MP4, MOV or WebM · multiple files allowed · up to 2 GB each"
      />

      {errors.length > 0 && (
        <div className="admin-media-error" role="alert">
          {errors.map((message) => <p key={message}>{message}</p>)}
          <button type="button" aria-label="Dismiss errors" onClick={() => setErrors([])}><X size={14} /></button>
        </div>
      )}

      {value.length > 0 && (
        <ol className="admin-video-list" aria-label={`${label} list`}>
          {value.map((video, index) => {
            const percent = progress[video.id]
            const isUploading = percent !== undefined && percent < 100
            return (
              <li key={video.id} className={`admin-video-item${isUploading ? ' uploading' : ''}`}>
                <div className="admin-video-row">
                  <span className="admin-video-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <VideoThumb video={video} isPlaying={playing === video.id} onToggle={() => setPlaying((current) => (current === video.id ? null : video.id))} />
                  <div className="admin-video-info">
                    <label className="sr-only" htmlFor={`${video.id}-title`}>Video {index + 1} title</label>
                    <input id={`${video.id}-title`} className="admin-video-title" value={video.title} onChange={(event) => update(video.id, { title: event.target.value })} />
                    <small>
                      <span className="admin-video-file">{video.fileName || 'Video file'}</span>
                      <span aria-hidden="true">·</span> {formatBytes(video.size)}
                      {video.duration > 0 && <><span aria-hidden="true">·</span> {formatDuration(video.duration)}</>}
                    </small>
                    {isUploading ? (
                      <div className="admin-progress" role="progressbar" aria-label={`Uploading ${video.title}`} aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
                        <span style={{ width: `${percent}%` }} />
                        <em>{paused[video.id] ? 'Paused' : 'Uploading'} · {Math.round(percent)}%</em>
                      </div>
                    ) : (
                      <span className="admin-video-ready">Ready</span>
                    )}
                  </div>
                  <div className="admin-video-actions">
                    {isUploading ? (
                      <button type="button" title={paused[video.id] ? 'Resume upload' : 'Pause upload'} aria-label={paused[video.id] ? 'Resume upload' : 'Pause upload'} onClick={() => setPaused((current) => ({ ...current, [video.id]: !current[video.id] }))}>
                        {paused[video.id] ? <Play size={15} /> : <Pause size={15} />}
                      </button>
                    ) : (
                      <ThumbnailButton onPick={(url) => update(video.id, { thumbnail: url })} />
                    )}
                    <button type="button" title="Move up" aria-label={`Move ${video.title} up`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={15} /></button>
                    <button type="button" title="Move down" aria-label={`Move ${video.title} down`} disabled={index === value.length - 1} onClick={() => move(index, 1)}><ArrowDown size={15} /></button>
                    <button type="button" className="danger" title={isUploading ? 'Cancel upload' : 'Remove video'} aria-label={`${isUploading ? 'Cancel upload of' : 'Remove'} ${video.title}`} onClick={() => remove(video.id)}>
                      {isUploading ? <X size={15} /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
                {playing === video.id && (
                  <video className="admin-video-player" src={video.url} poster={video.thumbnail || undefined} controls autoPlay playsInline>
                    <track kind="captions" />
                  </video>
                )}
              </li>
            )
          })}
        </ol>
      )}
      {hint && <small>{hint}</small>}
    </div>
  )
}

function VideoThumb({ video, isPlaying, onToggle }: { video: VideoAsset; isPlaying: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="admin-video-thumb" onClick={onToggle} aria-label={isPlaying ? `Close preview of ${video.title}` : `Preview ${video.title}`}>
      {video.thumbnail ? <img src={video.thumbnail} alt="" /> : <Clapperboard size={20} aria-hidden="true" />}
      <span className="admin-video-play" aria-hidden="true">{isPlaying ? <X size={14} /> : <Play size={14} />}</span>
      {video.duration > 0 && <span className="admin-video-duration">{formatDuration(video.duration)}</span>}
    </button>
  )
}

function ThumbnailButton({ onPick }: { onPick: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <button type="button" title="Set video thumbnail" aria-label="Set video thumbnail" onClick={() => inputRef.current?.click()}><ImagePlus size={15} /></button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file && file.type.startsWith('image/') && file.size <= MAX_IMAGE_BYTES) onPick(URL.createObjectURL(file))
          event.target.value = ''
        }}
      />
    </>
  )
}
