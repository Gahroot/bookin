/**
 * Color System Examples
 *
 * Demonstration components showing proper usage of the
 * Carbon Graphite color system.
 */

import { useThemeToggle } from '../../hooks/useColors'

/**
 * Primary Button - Main action
 */
export function PrimaryButton({ children, onClick, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        bg-primary text-primary-foreground
        hover:bg-primary-hover
        active:bg-primary-active
        disabled:bg-primary-disabled
        px-4 py-2 rounded-md
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >
      {children}
    </button>
  )
}

/**
 * Secondary Button - Less prominent action
 */
export function SecondaryButton({ children, onClick, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        bg-secondary text-secondary-foreground
        hover:bg-secondary-hover
        active:bg-secondary-active
        disabled:bg-secondary-disabled
        px-4 py-2 rounded-md
        border border-border
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >
      {children}
    </button>
  )
}

/**
 * Destructive Button - Dangerous action
 */
export function DestructiveButton({ children, onClick, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        bg-destructive text-destructive-foreground
        hover:bg-destructive-hover
        active:bg-destructive-active
        disabled:opacity-50 disabled:cursor-not-allowed
        px-4 py-2 rounded-md
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2
      "
    >
      {children}
    </button>
  )
}

/**
 * Alert Component - Feedback messages
 */
export function Alert({ type, title, message }: {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
}) {
  const styles = {
    success: 'bg-success text-success-foreground',
    error: 'bg-destructive text-destructive-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
  }

  return (
    <div className={`${styles[type]} rounded-md p-4`} role="alert">
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <p>{message}</p>
    </div>
  )
}

/**
 * Card Component - Surface element
 */
export function Card({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`
      bg-card text-card-foreground
      border border-border
      rounded-lg p-6
      shadow-sm
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * Text Hierarchy Example
 */
export function TextHierarchy() {
  return (
    <div className="space-y-2">
      <h1 className="text-text-primary text-3xl font-bold">
        Primary Text (Heading)
      </h1>
      <p className="text-text-primary">
        Primary text for main content and important information.
      </p>
      <p className="text-text-secondary">
        Secondary text for supporting content and descriptions.
      </p>
      <p className="text-text-tertiary">
        Tertiary text for subtle information and captions.
      </p>
      <p className="text-text-disabled">
        Disabled text for inactive or unavailable content.
      </p>
    </div>
  )
}

/**
 * Input Field Example
 */
export function Input({ label, placeholder, disabled }: {
  label: string
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <label className="text-text-primary text-sm font-medium">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full px-3 py-2
          bg-background text-foreground
          border border-input
          rounded-md
          placeholder:text-text-tertiary
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
    </div>
  )
}

/**
 * Badge Component
 */
export function Badge({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}) {
  const styles = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  }

  return (
    <span className={`
      ${styles[variant]}
      inline-flex items-center px-2.5 py-0.5
      rounded-full text-xs font-medium
    `}>
      {children}
    </span>
  )
}

/**
 * Theme Toggle Button
 */
export function ThemeToggle() {
  const [mode, toggle] = useThemeToggle()

  return (
    <button
      onClick={toggle}
      className="
        bg-secondary text-secondary-foreground
        hover:bg-secondary-hover
        px-3 py-2 rounded-md
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
      aria-label="Toggle theme"
    >
      {mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}

/**
 * Loading Skeleton
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`
      bg-muted
      animate-pulse
      rounded-md
      ${className}
    `} />
  )
}

/**
 * Divider
 */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <hr className={`border-border ${className}`} />
  )
}

/**
 * Complete Example Page
 */
export function ColorSystemDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-text-primary text-4xl font-bold mb-2">
              Carbon Graphite Color System
            </h1>
            <p className="text-text-secondary">
              Premium dark neutral - sleek minimalist for luxury brands
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Divider />

        {/* Text Hierarchy */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Text Hierarchy
          </h2>
          <TextHierarchy />
        </Card>

        {/* Buttons */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton>Primary</PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
            <SecondaryButton>Secondary</SecondaryButton>
            <DestructiveButton>Delete</DestructiveButton>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Feedback Messages
          </h2>
          <div className="space-y-3">
            <Alert
              type="success"
              title="Success"
              message="Your changes have been saved successfully."
            />
            <Alert
              type="error"
              title="Error"
              message="There was a problem processing your request."
            />
            <Alert
              type="warning"
              title="Warning"
              message="This action cannot be undone."
            />
            <Alert
              type="info"
              title="Information"
              message="New features are now available."
            />
          </div>
        </Card>

        {/* Form Elements */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Form Elements
          </h2>
          <div className="space-y-4">
            <Input label="Email" placeholder="Enter your email" />
            <Input label="Disabled Field" placeholder="Cannot edit" disabled />
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        </Card>

        {/* Loading State */}
        <Card>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            Loading States
          </h2>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      </div>
    </div>
  )
}
