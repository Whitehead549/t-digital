'use client'

import { useMemo, useState, useTransition } from 'react'
import { Check, CirclePlus, Edit3, Search, Trash2, X } from 'lucide-react'
import { deleteRecord, saveRecord } from '@/app/admin/actions'
import type { AdminRow, ResourceKey, ResourceOptions } from '@/lib/admin/resources'
import { resourceConfigs, type FieldConfig } from '@/components/admin/resource-config'

type Props = { resource: ResourceKey; rows: AdminRow[]; options: ResourceOptions }
type Editing = { id: string | number | null; values: Record<string, unknown> }

export default function ResourceManager({ resource, rows, options }: Props) {
  const config = resourceConfigs[resource]
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<Editing | null>(null)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const visibleRows = useMemo(() => {
    const value = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesQuery = !value || config.searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(value))
      const matchesStatus = !config.statusField || status === 'all' || row[config.statusField] === status
      return matchesQuery && matchesStatus
    })
  }, [config, query, rows, status])

  const flash = (tone: 'ok' | 'error', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 2600)
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

  const remove = (row: AdminRow) => {
    const name = String(row.title ?? row.name ?? row.reviewerName ?? row.customerName ?? `#${row.id}`)
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteRecord(resource, row.id)
      flash(result.ok ? 'ok' : 'error', result.ok ? `${capitalize(config.singular)} deleted` : result.error)
    })
  }

  return (
    <>
      <div className="admin-page-title">
        <div>
          <p className="admin-overline">Workspace / {config.title}</p>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <button className="admin-primary" type="button" onClick={openCreate}><CirclePlus size={16} /> Add {config.singular}</button>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search {config.title.toLowerCase()}</span>
          <input placeholder={`Search ${config.title.toLowerCase()}...`} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        {config.statusField && (
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="all">All status</option>
            {config.statusOptions?.map((option) => <option key={option} value={option}>{capitalize(option)}</option>)}
          </select>
        )}
        <button className="admin-filter" type="button" onClick={() => { setQuery(''); setStatus('all') }}>Reset</button>
      </div>

      <div className="admin-table-card" aria-busy={isPending}>
        <div className="admin-table-heading">
          <div><h3>All {config.title.toLowerCase()}</h3><span>{visibleRows.length} of {rows.length} shown</span></div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>{config.columns.map((column) => <th key={column.label}>{column.label}</th>)}<th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="admin-course-row" onClick={() => openEdit(row)}>
                  {config.columns.map((column) => <td key={column.label}>{column.render(row, { options })}</td>)}
                  <td>
                    <div className="admin-actions">
                      <button type="button" aria-label={`Edit ${config.singular}`} title="Edit" onClick={(event) => { event.stopPropagation(); openEdit(row) }}><Edit3 size={15} /></button>
                      <button type="button" className="delete-action" aria-label={`Delete ${config.singular}`} title="Delete" disabled={isPending} onClick={(event) => { event.stopPropagation(); remove(row) }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr><td className="admin-empty" colSpan={config.columns.length + 1}>No {config.title.toLowerCase()} found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {notice && <div className={`admin-toast ${notice.tone === 'error' ? 'error' : ''}`} role="status">{notice.tone === 'ok' ? <Check size={16} /> : <X size={16} />} {notice.text}</div>}

      {editing && (
        <div className="admin-modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget && !isPending) setEditing(null) }}>
          <form className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onSubmit={(event) => { event.preventDefault(); submit() }}>
            <button className="admin-modal-close" type="button" aria-label="Close" onClick={() => setEditing(null)}><X size={18} /></button>
            <p className="admin-overline">{editing.id ? `Edit ${config.singular}` : `Create ${config.singular}`}</p>
            <h2 id="admin-modal-title">{editing.id ? `Update ${config.singular} details` : `Add a new ${config.singular}`}</h2>
            <div className="admin-form-grid">
              {config.fields.map((field) => (
                <FieldInput key={field.name} field={field} value={editing.values[field.name]} options={options} onChange={(value) => setValue(field.name, value)} />
              ))}
            </div>
            {formError && <p className="admin-form-error" role="alert">{formError}</p>}
            <div className="admin-modal-actions">
              <button type="button" onClick={() => setEditing(null)} disabled={isPending}>Cancel</button>
              <button className="admin-primary" type="submit" disabled={isPending}>{isPending ? 'Saving…' : `Save ${config.singular}`}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

function FieldInput({ field, value, options, onChange }: { field: FieldConfig; value: unknown; options: ResourceOptions; onChange: (value: unknown) => void }) {
  const choices = field.optionsKey ? options[field.optionsKey] : (field.options ?? []).map((option) => ({ value: option, label: capitalize(option) }))
  const className = field.half ? 'admin-field half' : 'admin-field'

  if (field.type === 'checkbox') {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
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
      {field.label}
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
