import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void
}

export interface BookingFormData {
  firstName: string
  lastName: string
  phone: string
  reason: string
}

const CRM_WEBHOOK_URL = 'https://voice-noob-production.up.railway.app/webhooks/leads/website'
const CRM_API_KEY = import.meta.env.VITE_CRM_API_KEY

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-+()]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (!reason.trim()) {
      newErrors.reason = 'Please tell us what you\'d like to discuss'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      reason: reason.trim(),
    }

    // Send lead to CRM webhook
    try {
      const response = await fetch(`${CRM_WEBHOOK_URL}?api_key=${CRM_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          notes: formData.reason,
          source: 'website',
        }),
      })

      if (!response.ok) {
        console.error('Failed to submit lead to CRM:', response.status, response.statusText)
      }
    } catch (error) {
      // Log error but don't block form submission
      console.error('Error submitting lead to CRM:', error)
    }

    onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Before we meet...</h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself so we can make the most of our time together.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                errors.firstName ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                errors.lastName ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
              errors.phone ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Reason for Call */}
        <div className="space-y-2">
          <label htmlFor="reason" className="block text-sm font-medium">
            What would you like to discuss? <span className="text-destructive">*</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., I need help automating my lead follow-up process..."
            rows={3}
            className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none ${
              errors.reason ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.reason && (
            <p className="text-sm text-destructive">{errors.reason}</p>
          )}
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to receive communications about your inquiry. Your information is kept private and secure.
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Processing...' : 'Continue to Calendar'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
