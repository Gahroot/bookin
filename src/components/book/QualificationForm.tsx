'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import {
  BUDGETS,
  BUSINESS_TYPES,
  PROJECT_TYPES,
  REVENUE_OPTIONS,
  TIMELINES,
  type Option,
} from './options'

export interface QualificationData {
  businessType: string
  revenue: string
  projectType: string
  timeline: string
  budget: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  projectDetails: string
}

type Field = keyof QualificationData
type ChoiceField = 'businessType' | 'revenue' | 'projectType' | 'timeline' | 'budget'

const CHOICE_STEPS: { field: ChoiceField; title: string; options: Option[] }[] = [
  { field: 'businessType', title: 'What best describes your business?', options: BUSINESS_TYPES },
  { field: 'revenue', title: 'What is your current annual revenue?', options: REVENUE_OPTIONS },
  { field: 'projectType', title: 'What do you need help with?', options: PROJECT_TYPES },
  { field: 'timeline', title: 'When do you need this?', options: TIMELINES },
  { field: 'budget', title: 'What is your budget for this project?', options: BUDGETS },
]
const TOTAL = CHOICE_STEPS.length + 1

export const EMPTY: QualificationData = {
  businessType: '',
  revenue: '',
  projectType: '',
  timeline: '',
  budget: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  projectDetails: '',
}

export function validateContact(d: QualificationData): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {}
  if (!d.firstName.trim()) e.firstName = 'First name is required'
  if (!d.lastName.trim()) e.lastName = 'Last name is required'
  if (!d.email.trim()) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email'
  if (!d.phone.trim()) e.phone = 'Phone is required'
  else if (d.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number'
  return e
}

export function QualificationForm({
  onSubmit,
  onStart,
}: {
  onSubmit: (data: QualificationData, honeypot: string) => Promise<boolean>
  onStart?: () => void
}) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<QualificationData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const started = useRef(false)
  const honeypot = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const uid = useId()

  function touch() {
    if (!started.current) {
      started.current = true
      onStart?.()
    }
  }
  function set(field: Field, value: string) {
    touch()
    setData((d) => ({ ...d, [field]: value }))
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== field)))
  }
  function go(to: number) {
    setStep(to)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const choice = CHOICE_STEPS[step]
    if (choice) {
      if (!data[choice.field]) {
        setErrors({ [choice.field]: 'Choose one option to continue' })
        return
      }
      go(step + 1)
      return
    }
    const e = validateContact(data)
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setSubmitting(true)
    setFailed(false)
    const ok = await onSubmit(data, honeypot.current?.value ?? '')
    setSubmitting(false)
    if (!ok) setFailed(true)
  }

  const choice = CHOICE_STEPS[step]
  const title = choice ? choice.title : 'Where should I send the invite?'

  return (
    <form onSubmit={(e) => void handleSubmit(e)} noValidate aria-labelledby={`${uid}-title`}>
      <div className="flex items-center justify-between text-sm text-ink-muted">
        <span>
          Step {step + 1} of {TOTAL}
        </span>
        {step > 0 && (
          <button
            type="button"
            className="rounded-full px-3 py-1.5 font-medium text-ink hover:bg-[var(--glass-hover)]"
            onClick={() => {
              go(step - 1)
            }}
          >
            ← Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
        <div
          className="h-full rounded-full bg-action transition-[width] duration-300"
          style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
        />
      </div>
      <h2
        id={`${uid}-title`}
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 text-2xl font-semibold outline-none"
      >
        {title}
      </h2>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {choice ? (
        <fieldset
          className="mt-5"
          aria-describedby={errors[choice.field] ? `${uid}-err` : undefined}
        >
          <legend className="sr-only">{choice.title}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {choice.options.map((o) => {
              const checked = data[choice.field] === o.value
              return (
                <label
                  key={o.value}
                  className={`flex min-h-14 cursor-pointer flex-col justify-center rounded-[var(--radius-panel)] border px-4 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--focus)] ${
                    checked
                      ? 'border-action bg-[var(--glass-selected)] shadow-[var(--glass-rim-small)]'
                      : 'border-line bg-surface hover:border-line-strong'
                  }`}
                >
                  <input
                    type="radio"
                    name={choice.field}
                    value={o.value}
                    checked={checked}
                    onChange={() => {
                      set(choice.field, o.value)
                    }}
                    className="sr-only"
                  />
                  <span className="font-medium">{o.label}</span>
                  {o.description && <span className="text-sm text-ink-muted">{o.description}</span>}
                </label>
              )
            })}
          </div>
          {errors[choice.field] && (
            <p id={`${uid}-err`} role="alert" className="mt-3 text-sm text-danger">
              {errors[choice.field]}
            </p>
          )}
        </fieldset>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField
            uid={uid}
            field="firstName"
            label="First name"
            autoComplete="given-name"
            data={data}
            errors={errors}
            set={set}
          />
          <TextField
            uid={uid}
            field="lastName"
            label="Last name"
            autoComplete="family-name"
            data={data}
            errors={errors}
            set={set}
          />
          <TextField
            uid={uid}
            field="email"
            label="Work email"
            type="email"
            autoComplete="email"
            data={data}
            errors={errors}
            set={set}
          />
          <TextField
            uid={uid}
            field="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            data={data}
            errors={errors}
            set={set}
          />
          <TextField
            uid={uid}
            field="companyName"
            label="Company (optional)"
            autoComplete="organization"
            data={data}
            errors={errors}
            set={set}
          />
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-projectDetails`} className="text-sm font-medium">
              What would you like to fix first? (optional)
            </label>
            <textarea
              id={`${uid}-projectDetails`}
              rows={3}
              value={data.projectDetails}
              onChange={(e) => {
                set('projectDetails', e.target.value)
              }}
              className="mt-1.5 w-full rounded-[var(--radius-control)] border border-control-line bg-surface px-3 py-2.5"
            />
          </div>
        </div>
      )}

      {failed && (
        <p role="alert" className="mt-4 text-sm text-danger">
          Something went wrong sending your details. Please try again, or email SOLD@NolanGrout.com.
        </p>
      )}
      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {choice ? 'Continue' : submitting ? 'Sending…' : 'See available times'}
        </button>
      </div>
    </form>
  )
}

function TextField({
  uid,
  field,
  label,
  type = 'text',
  autoComplete,
  data,
  errors,
  set,
}: {
  uid: string
  field: Field
  label: string
  type?: string
  autoComplete: string
  data: QualificationData
  errors: Partial<Record<Field, string>>
  set: (f: Field, v: string) => void
}) {
  const id = `${uid}-${field}`
  const err = errors[field]
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={data[field]}
        aria-invalid={err ? true : undefined}
        aria-describedby={err ? `${id}-err` : undefined}
        onChange={(e) => {
          set(field, e.target.value)
        }}
        className="mt-1.5 min-h-11 w-full rounded-[var(--radius-control)] border border-control-line bg-surface px-3"
      />
      {err && (
        <p id={`${id}-err`} className="mt-1 text-sm text-danger">
          {err}
        </p>
      )}
    </div>
  )
}
