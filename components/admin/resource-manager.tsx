'use client'

import { useMemo, useState, useTransition } from 'react'
import { AlertTriangle, Check, Edit3, Inbox, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react'
import { deleteRecord, saveRecord } from '@/app/admin/actions'
import type { AdminRow, ResourceKey, ResourceOptions } from '@/lib/admin/resources'
import { resourceConfigs, type FieldConfig } from '@/components/admin/resource-config'
import { adminNavItems } from '@/components/admin/nav-items'

type Props = { resource: ResourceKey; rows: AdminRow[]; options: ResourceOptions }
type Editing = { id: string | number | null; values: Record<string, unknown> }

const rowName = (row: AdminRow) => String(row.title ?? row.name ?? row.reviewerName ?? row.customerName ?? `#${row.id}`)

export default function ResourceManager({ resource, rows, options }: Props) {
  const config = resourceConfigs[resource]
  const Icon = adminNavItems.find((item) => item.href === `/admin/${resource}`)?.icon ?? Inbox
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<Editing | null>(null)
  const [confirming, setConfirming] = useState<AdminRow | null>(null)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    if (config.statusField) for (const row of rows) counts[String(row[config.statusField])] = (counts[String(row[config.statusField])] ?? 0) + 1
    return counts
  }, [config.statusField, rows])

  const visibleRows = useMemo(() => {
    const value = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesQuery = !value || config.searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(value))
      const matchesStatus = !config.statusField || status === 'all' || row[config.statusField] === status
      return matchesQuery && matchesStatus
    })
  }, [config, query, rows, status])

  const filtersActive = query.trim() !== '' || status !== 'all'

  const flash = (tone: 'ok' | 'error', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 2800)
  }

  const openCreate = () => {
    const defaults = { ...config.defaults }
    if (resource === 'courses' && !defaults.categoryId) defaults.categoryId = options.categories[0]?.value ?? ''
    if (resource === 'reviews' && !defaults.courseId) defaults.courseId = options.courses[0]?.value ?? ''
    setFormError('')
    setEditing({ id: null, values: defaults })
  }

  const openEdit = (row: AdminRow) => {
    const values: Record<string, unknown> = {}
    for (const field of config.fields) values[field.name] = row[field.name]
    setFormError('')
    setEditing({ id: row.id, values })
  }

  const setValue = (name: string, value: unknown) => setEditing((current) => (current ? { ...current, values: { ...current.values, [name]: value } } : current))

  const submit = () => {
    if (!editing) return
    startTransition(async () => {
      const result = await saveRecord(resource, editing.id, editing.values)
      if (!result.ok) return setFormError(result.error)
      setEditing(null)
      flash('ok', `${capitalize(config.singular)} ${editing.id ? 'updated' : 'created'} successfully`)
    })
  }

  const confirmDelete = () => {
    if (!confirming) return
    const row = confirming
    startTransition(async () => {
      const result = await deleteRecord(resource, row.id)
      setConfirming(null)
      flash(result.ok ? 'ok' : 'error', result.ok ? `${capitalize(config.singular)} deleted` : result.error)
    })
  }

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
  }

  return (
    <div className="admin-stack">
      <header className="admin-page-title">
        <div className="admin-page-title-main">
          <span className="admin-page-icon"><Icon size={22} aria-hidden="true" /></span>
          <div>
            <h1>{config.title} <span className="admin-total">{rows.length}</span></h1>
            <p>{config.description}</p>
          </div>
        </div>
        <button className="admin-primary" type="button" onClick={openCreate}><Plus size={16} aria-hidden="true" /> Add {config.singular}</button>
      </header>

      <section className="admin-table-card" aria-busy={isPending} aria-label={`${config.title} list`}>
        <div className="admin-toolbar">
          {config.statusField ? (
            <div className="admin-tabs" role="tablist" aria-label="Filter by status">
              {['all', ...(config.statusOptions ?? [])].map((option) => (
                <button key={option} type="button" role="tab" aria-selected={status === option} className={status === option ? 'active' : undefined} onClick={() => setStatus(option)}>
                  {option === 'all' ? 'All' : capitalize(option)}
                  <span>{option === 'all' ? rows.length : statusCounts[option] ?? 0}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="admin-toolbar-meta">{visibleRows.length} of {rows.length} {config.title.toLowerCase()}</p>
          )}
          <div className="admin-toolbar-right">
            <label className="admin-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search {config.title.toLowerCase()}</span>
              <input placeholder={`Search ${config.title.toLowerCase()}…`} value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            {filtersActive && (
              <button className="admin-ghost" type="button" onClick={resetFilters}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
            )}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>{config.columns.map((column) => <th key={column.label}>{column.label}</th>)}<th className="admin-th-actions"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="admin-course-row" onClick={() => openEdit(row)}>
                  {config.columns.map((column) => <td key={column.label}>{column.render(row, { options })}</td>)}
                  <td>
                    <div className="admin-actions">
                      <button type="button" aria-label={`Edit ${rowName(row)}`} title="Edit" onClick={(event) => { event.stopPropagation(); openEdit(row) }}><Edit3 size={15} /></button>
                      <button type="button" className="delete-action" aria-label={`Delete ${rowName(row)}`} title="Delete" disabled={isPending} onClick={(event) => { event.stopPropagation(); setConfirming(row) }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleRows.length === 0 && (
            <div className="admin-empty-state">
              <span><Inbox size={22} aria-hidden="true" /></span>
              <b>{filtersActive ? `No ${config.title.toLowerCase()} match your filters` : `No ${config.title.toLowerCase()} yet`}</b>
              <p>{filtersActive ? 'Try a different search term or status.' : `Create your first ${config.singular} to get started.`}</p>
              {filtersActive ? (
                <button className="admin-ghost" type="button" onClick={resetFilters}><RotateCcw size={14} aria-hidden="true" /> Clear filters</button>
              ) : (
                <button className="admin-primary" type="button" onClick={openCreate}><Plus size={16} aria-hidden="true" /> Add {config.singular}</button>
              )}
            </div>
          )}
        </div>

        {visibleRows.length > 0 && (
          <div className="admin-table-foot">Showing <b>{visibleRows.length}</b> of <b>{rows.length}</b> {config.title.toLowerCase()} · Click a row to edit</div>
        )}
      </section>

      {notice && (
        <div className={`admin-toast${notice.tone === 'error' ? ' error' : ''}`} role="status">
          <span>{notice.tone === 'ok' ? <Check size={14} /> : <X size={14} />}</span>
          {notice.text}
        </div>
      )}

      {editing && (
        <div className="admin-modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget && !isPending) setEditing(null) }}>
          <form className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onSubmit={(event) => { event.preventDefault(); submit() }}>
            <div className="admin-modal-head">
              <span className="admin-page-icon small"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <p className="admin-overline">{editing.id ? `Edit ${config.singular}` : `New ${config.singular}`}</p>
                <h2 id="admin-modal-title">{editing.id ? `Update ${config.singular} details` : `Add a new ${config.singular}`}</h2>
              </div>
              <button className="admin-modal-close" type="button" aria-label="Close" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid">
                {config.fields.map((field) => (
                  <FieldInput key={field.name} field={field} value={editing.values[field.name]} options={options} onChange={(value) => setValue(field.name, value)} />
                ))}
              </div>
              {formError && <p className="admin-form-error" role="alert"><AlertTriangle size={15} aria-hidden="true" /> {formError}</p>}
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary" onClick={() => setEditing(null)} disabled={isPending}>Cancel</button>
              <button className="admin-primary" type="submit" disabled={isPending}>{isPending ? 'Saving…' : `Save ${config.singular}`}</button>
            </div>
          </form>
        </div>
      )}

      {confirming && (
        <div className="admin-modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget && !isPending) setConfirming(null) }}>
          <div className="admin-modal admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-desc">
            <div className="admin-modal-body">
              <span className="admin-confirm-icon"><Trash2 size={20} aria-hidden="true" /></span>
              <h2 id="admin-confirm-title">Delete this {config.singular}?</h2>
              <p id="admin-confirm-desc">
                <b>{rowName(confirming)}</b> will be permanently removed. This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary" onClick={() => setConfirming(null)} disabled={isPending}>Cancel</button>
              <button type="button" className="admin-primary danger" onClick={confirmDelete} disabled={isPending} autoFocus>{isPending ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ field, value, options, onChange }: { field: FieldConfig; value: unknown; options: ResourceOptions; onChange: (value: unknown) => void }) {
  const choices = field.optionsKey ? options[field.optionsKey] : (field.options ?? []).map((option) => ({ value: option, label: capitalize(option) }))
  const className = field.half ? 'admin-field half' : 'admin-field'

  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} />
        <span className="admin-switch" aria-hidden="true" />
        <span>{field.label}</span>
      </label>
    )
  }

  if (field.type === 'multiselect') {
    const selected = Array.isArray(value) ? (value as string[]) : []
    return (
      <fieldset className="admin-field admin-multiselect">
        <legend>{field.label} <small>{selected.length} selected</small></legend>
        <div>
          {choices.map((choice) => (
            <label key={choice.value}>
              <input type="checkbox" checked={selected.includes(choice.value)} onChange={(event) => onChange(event.target.checked ? [...selected, choice.value] : selected.filter((item) => item !== choice.value))} />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  return (
    <label className={className}>
      <span className="admin-field-label">{field.label}{field.required && <em aria-hidden="true"> *</em>}</span>
      {field.type === 'textarea' ? (
        <textarea required={field.required} rows={3} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
      ) : field.type === 'select' ? (
        <select required={field.required} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>
          {choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
        </select>
      ) : (
        <input
          type={field.type}
          required={field.required}
          step={field.step}
          min={field.min}
          max={field.max}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(event) => onChange(field.type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)}
        />
      )}
      {field.hint && <small>{field.hint}</small>}
    </label>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
