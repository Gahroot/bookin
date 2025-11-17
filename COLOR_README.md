# Carbon Graphite Color System

A professional, WCAG AA compliant color system for luxury brands and minimalist design.

## Quick Start

### 1. Import in your component
```tsx
import { useThemeToggle, Colors } from '@/lib/colors'
```

### 2. Use Tailwind classes
```tsx
<button className={Colors.classes.primary}>
  Primary Button
</button>
```

### 3. Toggle theme
```tsx
const [mode, toggle] = useThemeToggle()
<button onClick={toggle}>Toggle Theme</button>
```

## Base Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #18181b | Main actions, headers, brand |
| Secondary | #3f3f46 | Secondary actions, supporting UI |
| Accent | #71717a | Highlights, decorative elements |
| Background | #fafafa | Page background |
| Surface | #f4f4f5 | Cards, elevated surfaces |

## Features

- **160+ color tokens** for comprehensive coverage
- **Light & Dark modes** with seamless switching
- **WCAG AA compliant** - all text meets 4.5:1 contrast
- **State variants** - hover, active, disabled for all interactive colors
- **TypeScript support** - full type definitions
- **React hooks** - easy theme management
- **OKLCH color space** - perceptually uniform colors

## Documentation

- **[COLOR_SYSTEM.md](./COLOR_SYSTEM.md)** - Complete documentation (400+ lines)
- **[COLOR_QUICK_REFERENCE.md](./COLOR_QUICK_REFERENCE.md)** - Fast lookup guide
- **[COLOR_IMPLEMENTATION_SUMMARY.md](./COLOR_IMPLEMENTATION_SUMMARY.md)** - Technical details

## File Structure

```
src/
├── index.css                    # Color definitions (main file)
├── types/colors.ts              # TypeScript types
├── hooks/useColors.ts           # React hooks
├── lib/colors.ts                # Central exports
├── components/examples/
│   └── ColorExamples.tsx        # Example components
└── pages/
    └── ColorDemo.tsx            # Visual demo page
```

## Common Usage

### Buttons
```tsx
// Primary
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Save
</button>

// Secondary
<button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover">
  Cancel
</button>

// Destructive
<button className="bg-destructive text-destructive-foreground hover:bg-destructive-hover">
  Delete
</button>
```

### Text Hierarchy
```tsx
<h1 className="text-text-primary">Main Heading</h1>
<p className="text-text-secondary">Supporting text</p>
<span className="text-text-tertiary">Caption text</span>
```

### Alerts
```tsx
<div className="bg-success text-success-foreground p-4 rounded">
  Success message
</div>

<div className="bg-destructive text-destructive-foreground p-4 rounded">
  Error message
</div>
```

### Cards
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-6">
  Card content
</div>
```

### Theme Toggle
```tsx
import { useThemeToggle } from '@/lib/colors'
import { Moon, Sun } from 'lucide-react'

function ThemeButton() {
  const [mode, toggle] = useThemeToggle()
  return (
    <button onClick={toggle} className="flex items-center gap-2">
      {mode === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          Dark
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          Light
        </>
      )}
    </button>
  )
}
```

## Accessibility

All color combinations meet WCAG AA standards:

| Combination | Contrast Ratio | Standard |
|-------------|----------------|----------|
| Primary on Background | 13.8:1 | AAA |
| Secondary on Background | 9.2:1 | AAA |
| Tertiary on Background | 4.8:1 | AA |
| All feedback colors | 4.5:1+ | AA |

## Browser Support

Requires modern browser with OKLCH support:
- Chrome 111+
- Safari 15.4+
- Firefox 113+

## Testing

View the complete color system:
1. Navigate to `/color-demo` route
2. See all colors, states, and contrast ratios
3. Toggle between light and dark modes
4. Test interactive components

## Key Concepts

### Semantic Naming
Use semantic names instead of descriptive ones:
- ✅ `--primary` (semantic)
- ❌ `--dark-grey` (descriptive)

### State Variants
All interactive colors have states:
- `default` - base color
- `hover` - mouse hover
- `active` - being clicked
- `disabled` - non-interactive

### Text Hierarchy
Four levels of text importance:
- `text-primary` - main content (13.8:1)
- `text-secondary` - supporting text (9.2:1)
- `text-tertiary` - subtle text (4.8:1)
- `text-disabled` - inactive text (3.1:1)

## Best Practices

1. **Always test contrast** - Use browser DevTools to verify
2. **Use semantic colors** - Primary for main actions, destructive for dangerous actions
3. **Maintain hierarchy** - Use text-primary for important content
4. **Test both modes** - Verify in light and dark themes
5. **Include focus states** - Use the `Colors.focus` utility
6. **Consider disabled states** - Show clear visual feedback

## Examples

See complete examples in:
- `/src/components/examples/ColorExamples.tsx` - React components
- `/src/pages/ColorDemo.tsx` - Full demo page
- `COLOR_SYSTEM.md` - Code snippets

## TypeScript

Full type definitions available:

```tsx
import type { ColorVariable, ThemeMode, SemanticColor } from '@/types/colors'

const myColor: ColorVariable = 'primary'
const theme: ThemeMode = 'dark'
const semantic: SemanticColor = 'destructive'
```

## Utilities

### Colors Object
```tsx
import { Colors } from '@/lib/colors'

Colors.get('primary')           // 'var(--primary)'
Colors.classes.primary          // Full button classes
Colors.text.secondary           // Text classes
Colors.border.default           // Border classes
Colors.focus                    // Focus ring classes
```

### Hooks
```tsx
import {
  useThemeToggle,
  useThemeMode,
  useSystemTheme,
  useColorValue
} from '@/lib/colors'
```

## Support

For issues or questions:
1. Check the full documentation in `COLOR_SYSTEM.md`
2. Review examples in `ColorExamples.tsx`
3. See the quick reference in `COLOR_QUICK_REFERENCE.md`
4. Test in the demo page at `/color-demo`

---

**Palette:** Carbon Graphite
**Standard:** WCAG AA
**Color Space:** OKLCH
**Status:** Production Ready ✅
