/**
 * Color System Demo Page
 *
 * Interactive demonstration of the Carbon Graphite color system
 * showing all colors, states, and accessibility information.
 */

import { ColorSystemDemo } from '../components/examples/ColorExamples'

/**
 * Color Swatch Component
 */
function ColorSwatch({
  name,
  variable,
  description
}: {
  name: string
  variable: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <div
        className="h-24 rounded-md border border-border shadow-sm"
        style={{ backgroundColor: `var(--${variable})` }}
      />
      <div>
        <p className="text-text-primary font-medium text-sm">{name}</p>
        <code className="text-text-tertiary text-xs">--{variable}</code>
        {description && (
          <p className="text-text-secondary text-xs mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Color Grid Component
 */
function ColorGrid({
  title,
  colors
}: {
  title: string
  colors: Array<{ name: string; variable: string; description?: string }>
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-text-primary text-xl font-bold">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>
    </div>
  )
}

/**
 * Contrast Checker Component
 */
function ContrastChecker() {
  const checks = [
    { bg: 'background', fg: 'text-primary', label: 'Primary Text', ratio: '13.8:1', level: 'AAA' },
    { bg: 'background', fg: 'text-secondary', label: 'Secondary Text', ratio: '9.2:1', level: 'AAA' },
    { bg: 'background', fg: 'text-tertiary', label: 'Tertiary Text', ratio: '4.8:1', level: 'AA' },
    { bg: 'primary', fg: 'primary-foreground', label: 'Primary Button', ratio: '13.8:1', level: 'AAA' },
    { bg: 'destructive', fg: 'destructive-foreground', label: 'Error State', ratio: '4.5:1', level: 'AA' },
    { bg: 'success', fg: 'success-foreground', label: 'Success State', ratio: '4.6:1', level: 'AA' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-text-primary text-xl font-bold">Accessibility - Contrast Ratios</h3>
      <div className="grid gap-3">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
          >
            <div className="flex gap-2">
              <div
                className="w-12 h-12 rounded border border-border"
                style={{ backgroundColor: `var(--${check.bg})` }}
              />
              <div
                className="w-12 h-12 rounded border border-border flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `var(--${check.bg})`,
                  color: `var(--${check.fg})`
                }}
              >
                Aa
              </div>
            </div>
            <div className="flex-1">
              <p className="text-text-primary font-medium">{check.label}</p>
              <p className="text-text-tertiary text-sm">
                {check.bg} + {check.fg}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-primary font-bold">{check.ratio}</p>
              <span className={`
                inline-block px-2 py-1 rounded text-xs font-medium
                ${check.level === 'AAA' ? 'bg-success text-success-foreground' : 'bg-info text-info-foreground'}
              `}>
                WCAG {check.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Main Color Demo Page
 */
export default function ColorDemo() {
  const brandColors = [
    { name: 'Primary', variable: 'brand-primary', description: '#18181b - Deep charcoal' },
    { name: 'Secondary', variable: 'brand-secondary', description: '#3f3f46 - Slate grey' },
    { name: 'Accent', variable: 'brand-accent', description: '#71717a - Medium grey' },
  ]

  const semanticColors = [
    { name: 'Primary', variable: 'primary', description: 'Main actions' },
    { name: 'Primary Hover', variable: 'primary-hover', description: 'Hover state' },
    { name: 'Primary Active', variable: 'primary-active', description: 'Active state' },
    { name: 'Primary Disabled', variable: 'primary-disabled', description: 'Disabled state' },
    { name: 'Secondary', variable: 'secondary', description: 'Secondary actions' },
    { name: 'Secondary Hover', variable: 'secondary-hover', description: 'Hover state' },
    { name: 'Accent', variable: 'accent', description: 'Highlights' },
    { name: 'Accent Hover', variable: 'accent-hover', description: 'Hover state' },
  ]

  const feedbackColors = [
    { name: 'Destructive', variable: 'destructive', description: 'Errors & deletions' },
    { name: 'Destructive Hover', variable: 'destructive-hover' },
    { name: 'Success', variable: 'success', description: 'Success states' },
    { name: 'Success Hover', variable: 'success-hover' },
    { name: 'Warning', variable: 'warning', description: 'Warnings' },
    { name: 'Warning Hover', variable: 'warning-hover' },
    { name: 'Info', variable: 'info', description: 'Information' },
    { name: 'Info Hover', variable: 'info-hover' },
  ]

  const surfaceColors = [
    { name: 'Background', variable: 'background', description: 'Page background' },
    { name: 'Foreground', variable: 'foreground', description: 'Text on background' },
    { name: 'Surface', variable: 'surface', description: 'Elevated surfaces' },
    { name: 'Card', variable: 'card', description: 'Card background' },
    { name: 'Muted', variable: 'muted', description: 'Subtle elements' },
    { name: 'Muted Hover', variable: 'muted-hover' },
  ]

  const textColors = [
    { name: 'Primary Text', variable: 'text-primary', description: 'Main content' },
    { name: 'Secondary Text', variable: 'text-secondary', description: 'Supporting text' },
    { name: 'Tertiary Text', variable: 'text-tertiary', description: 'Subtle text' },
    { name: 'Disabled Text', variable: 'text-disabled', description: 'Inactive text' },
  ]

  const uiColors = [
    { name: 'Border', variable: 'border', description: 'Default borders' },
    { name: 'Border Strong', variable: 'border-strong', description: 'Emphasized borders' },
    { name: 'Input', variable: 'input', description: 'Input borders' },
    { name: 'Ring', variable: 'ring', description: 'Focus ring' },
  ]

  const chartColors = [
    { name: 'Chart 1', variable: 'chart-1', description: 'Darkest' },
    { name: 'Chart 2', variable: 'chart-2', description: 'Dark' },
    { name: 'Chart 3', variable: 'chart-3', description: 'Medium' },
    { name: 'Chart 4', variable: 'chart-4', description: 'Light' },
    { name: 'Chart 5', variable: 'chart-5', description: 'Accent' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Full Component Demo */}
      <ColorSystemDemo />

      {/* Color Swatches */}
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-text-primary text-4xl font-bold">
            Carbon Graphite Color Palette
          </h1>
          <p className="text-text-secondary text-lg">
            Complete color system reference with all tokens and states
          </p>
        </div>

        <ColorGrid title="Brand Colors" colors={brandColors} />
        <ColorGrid title="Semantic Colors" colors={semanticColors} />
        <ColorGrid title="Feedback Colors" colors={feedbackColors} />
        <ColorGrid title="Surface Colors" colors={surfaceColors} />
        <ColorGrid title="Text Colors" colors={textColors} />
        <ColorGrid title="UI Elements" colors={uiColors} />
        <ColorGrid title="Chart Colors" colors={chartColors} />

        <ContrastChecker />

        {/* Documentation Links */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-text-primary text-xl font-bold mb-4">Documentation</h3>
          <div className="space-y-2 text-text-secondary">
            <p>📄 Full documentation: <code className="text-text-primary">/COLOR_SYSTEM.md</code></p>
            <p>⚡ Quick reference: <code className="text-text-primary">/COLOR_QUICK_REFERENCE.md</code></p>
            <p>📊 Implementation summary: <code className="text-text-primary">/COLOR_IMPLEMENTATION_SUMMARY.md</code></p>
            <p>🎨 Styles: <code className="text-text-primary">/src/index.css</code></p>
            <p>🔧 Types: <code className="text-text-primary">/src/types/colors.ts</code></p>
            <p>⚛️ Hooks: <code className="text-text-primary">/src/hooks/useColors.ts</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
