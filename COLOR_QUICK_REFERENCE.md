# Carbon Graphite - Quick Reference

## Base Colors (Hex)
```
Primary:    #18181b
Secondary:  #3f3f46
Accent:     #71717a
Background: #fafafa
Surface:    #f4f4f5
```

## Tailwind Classes

### Buttons
```tsx
// Primary
className="bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active"

// Secondary
className="bg-secondary text-secondary-foreground hover:bg-secondary-hover"

// Destructive
className="bg-destructive text-destructive-foreground hover:bg-destructive-hover"
```

### Text
```tsx
className="text-text-primary"     // Main content
className="text-text-secondary"   // Supporting text
className="text-text-tertiary"    // Subtle text
className="text-text-disabled"    // Disabled text
```

### Surfaces
```tsx
className="bg-background text-foreground"  // Page
className="bg-card text-card-foreground"   // Card
className="bg-surface"                     // Elevated surface
```

### Borders & Inputs
```tsx
className="border border-border"           // Default border
className="border border-border-strong"    // Emphasized border
className="border border-input"            // Input field
```

### Feedback
```tsx
className="bg-success text-success-foreground"      // Success
className="bg-destructive text-destructive-foreground" // Error
className="bg-warning text-warning-foreground"      // Warning
className="bg-info text-info-foreground"            // Info
```

### Focus States
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

## CSS Variables

### Direct Usage
```css
.custom {
  background: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}

.custom:hover {
  background: var(--primary-hover);
}
```

## React Hooks

### Theme Toggle
```tsx
import { useThemeToggle } from '@/hooks/useColors'

const [mode, toggle] = useThemeToggle()
```

### Get Color Value
```tsx
import { useColorValue } from '@/hooks/useColors'

const primaryColor = useColorValue('primary')
```

### System Theme
```tsx
import { useSystemTheme } from '@/hooks/useColors'

const systemTheme = useSystemTheme()
```

## Accessibility

### Contrast Ratios (Light Mode)
- Primary on Background: 13.8:1 (AAA)
- Secondary on Background: 9.2:1 (AAA)
- Tertiary on Background: 4.8:1 (AA)

### Requirements
- Normal Text: 4.5:1 minimum (AA)
- Large Text: 3:1 minimum (AA)
- All combinations tested and compliant

## Common Patterns

### Card
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-6">
  <h2 className="text-text-primary font-bold">Title</h2>
  <p className="text-text-secondary">Description</p>
</div>
```

### Alert
```tsx
<div className="bg-destructive text-destructive-foreground rounded-md p-4">
  Error message
</div>
```

### Input
```tsx
<input className="
  bg-background text-foreground
  border border-input
  rounded-md px-3 py-2
  focus-visible:ring-2 focus-visible:ring-ring
" />
```

### Badge
```tsx
<span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs">
  Label
</span>
```

## Files
- **Colors**: `/src/index.css`
- **Types**: `/src/types/colors.ts`
- **Hooks**: `/src/hooks/useColors.ts`
- **Examples**: `/src/components/examples/ColorExamples.tsx`
- **Full Docs**: `/COLOR_SYSTEM.md`

## Dark Mode

### Toggle
```tsx
document.documentElement.classList.toggle('dark')
```

### Check Current
```tsx
document.documentElement.classList.contains('dark')
```

### With Persistence
```tsx
const [mode, toggle] = useThemeToggle() // Auto-saves to localStorage
```
