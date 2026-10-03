'use client'

import { useEffect, useRef, useState } from 'react'
import { Award, Download, LoaderCircle, X } from 'lucide-react'
import type { Certificate } from '@/lib/data/dashboard'

const extensionFor = (mime: string) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' })[mime] ?? 'png'

function fileNameFor(cert: Certificate, mime: string) {
  const slug = cert.course.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  return `TORVAN-Certificate-${cert.id}${slug ? `-${slug}` : ''}.${extensionFor(mime)}`
}

function triggerDownload(href: string, fileName: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function downloadCertificate(cert: Certificate) {
  const image = cert.image
  if (!image) return
  if (image.startsWith('data:')) {
    const mime = image.slice(5, image.indexOf(';'))
    return triggerDownload(image, fileNameFor(cert, mime))
  }
  try {
    const response = await fetch(image)
    if (!response.ok) throw new Error(`Download failed with ${response.status}`)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    triggerDownload(url, fileNameFor(cert, blob.type))
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch {
    // Cross-origin images without CORS cannot be fetched; opening them lets the student save it manually.
    window.open(image, '_blank', 'noopener,noreferrer')
  }
}

function DownloadButton({ cert, className = 'sd-primary-btn' }: { cert: Certificate; className?: string }) {
  const [downloading, setDownloading] = useState(false)
  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadCertificate(cert)
    } finally {
      setDownloading(false)
    }
  }
  return (
    <button type="button" className={className} onClick={handleDownload} disabled={downloading} aria-label={`Download certificate for ${cert.course}`}>
      {downloading ? <LoaderCircle size={16} className="sd-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
      {downloading ? 'Preparing…' : 'Download'}
    </button>
  )
}

export default function CertificatesPanel({ certificates }: { certificates: Certificate[] }) {
  const [selected, setSelected] = useState<Certificate | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selected && !dialog.open) dialog.showModal()
    if (!selected && dialog.open) dialog.close()
  }, [selected])

  if (certificates.length === 0) {
    return (
      <section className="sd-card sd-certs" id="certificates" aria-label="Certificates">
        <div className="sd-empty">
          <span className="sd-empty-icon"><Award size={24} aria-hidden="true" /></span>
          <strong>No certificates yet</strong>
          <p>When the TORVAN team issues your certificate, it will appear here for you to download.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="sd-certs-grid" id="certificates" aria-label="Certificates">
      {certificates.map((cert) => (
        <article key={cert.id} className="sd-cert-card">
          <button type="button" className="sd-cert-card-img" onClick={() => setSelected(cert)} aria-label={`Enlarge certificate for ${cert.course}`}>
            <img src={cert.image} alt={`Certificate for ${cert.course}`} loading="lazy" />
          </button>
          <div className="sd-cert-card-foot">
            <div className="sd-cert-card-info">
              <strong>{cert.course}</strong>
              <span>Issued {cert.completedOn}</span>
            </div>
            <DownloadButton cert={cert} />
          </div>
        </article>
      ))}

      <dialog ref={dialogRef} className="sd-dialog sd-cert-dialog" onClose={() => setSelected(null)} aria-label={selected ? `Certificate for ${selected.course}` : 'Certificate'}>
        {selected && (
          <div className="sd-dialog-inner">
            <button type="button" className="sd-icon-btn sd-cert-dialog-close" aria-label="Close" onClick={() => setSelected(null)}>
              <X size={18} aria-hidden="true" />
            </button>
            <img className="sd-cert-dialog-img" src={selected.image} alt={`Certificate for ${selected.course}`} />
            <div className="sd-dialog-actions">
              <DownloadButton cert={selected} />
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
