'use client'

import { useEffect, useRef, useState } from 'react'
import { Award, BadgeCheck, Eye, X } from 'lucide-react'
import { student, type Certificate } from '@/lib/data/dashboard'

function CertificateArt({ course, large = false }: { course: string; large?: boolean }) {
  return (
    <div className={`sd-cert-art ${large ? 'is-lg' : ''}`} aria-hidden="true">
      <span className="sd-cert-brand">TORVAN<i>.</i></span>
      <small>Certificate of Completion</small>
      {large && <em>{student.fullName}</em>}
      <strong>{course}</strong>
      <span className="sd-cert-seal"><Award size={large ? 22 : 14} /></span>
    </div>
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

  return (
    <section className="sd-card sd-certs" id="certificates" aria-labelledby="certs-title">
      <div className="sd-card-head">
        <div>
          <p className="sd-eyebrow">Achievements</p>
          <h2 id="certs-title">Certificates</h2>
        </div>
        {certificates.length > 0 && <span className="sd-count-pill">{certificates.length} earned</span>}
      </div>

      {certificates.length === 0 ? (
        <div className="sd-empty">
          <span className="sd-empty-icon"><Award size={24} aria-hidden="true" /></span>
          <strong>No certificates yet</strong>
          <p>Finish your first course to earn a verified certificate you can share with employers.</p>
          <a href="/dashboard/courses" className="sd-primary-btn">Keep learning</a>
        </div>
      ) : (
        <ul className="sd-cert-list">
          {certificates.map((cert) => (
            <li key={cert.id}>
              <button type="button" className="sd-cert" onClick={() => setSelected(cert)} aria-label={`View certificate for ${cert.course}`}>
                <CertificateArt course={cert.course} />
                <span className="sd-cert-info">
                  <strong>{cert.course}</strong>
                  <span>Completed {cert.completedOn}</span>
                  <span className="sd-cert-id">ID {cert.id}</span>
                </span>
                <span className="sd-cert-side">
                  {cert.verified && <span className="sd-verified"><BadgeCheck size={13} aria-hidden="true" /> Verified</span>}
                  <span className="sd-cert-view"><Eye size={14} aria-hidden="true" /> View Certificate</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog ref={dialogRef} className="sd-dialog" onClose={() => setSelected(null)} aria-labelledby="cert-dialog-title">
        {selected && (
          <div className="sd-dialog-inner">
            <div className="sd-dialog-head">
              <div>
                <p className="sd-eyebrow">Certificate preview</p>
                <h2 id="cert-dialog-title">{selected.course}</h2>
              </div>
              <button type="button" className="sd-icon-btn" aria-label="Close certificate preview" onClick={() => setSelected(null)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <CertificateArt course={selected.course} large />
            <dl className="sd-dialog-meta">
              <div><dt>Issued to</dt><dd>{student.fullName}</dd></div>
              <div><dt>Instructor</dt><dd>{selected.instructor}</dd></div>
              <div><dt>Completed</dt><dd>{selected.completedOn}</dd></div>
              <div><dt>Certificate ID</dt><dd>{selected.id}</dd></div>
            </dl>
            {selected.verified && <p className="sd-verified is-lg"><BadgeCheck size={15} aria-hidden="true" /> This certificate is verified by TORVAN</p>}
          </div>
        )}
      </dialog>
    </section>
  )
}
