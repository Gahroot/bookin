# Icon Reference Guide

Quick reference for all icon replacements made in the codebase.

## Icon Usage by Component

### ColorDemo.tsx
Used for documentation links:

```tsx
import { FileText, Zap, BarChart, Palette, Wrench, Code } from 'lucide-react'

<FileText className="w-4 h-4" />   // Full documentation
<Zap className="w-4 h-4" />         // Quick reference
<BarChart className="w-4 h-4" />    // Implementation summary
<Palette className="w-4 h-4" />     // Styles
<Wrench className="w-4 h-4" />      // Types
<Code className="w-4 h-4" />        // Hooks (React)
```

### ColorExamples.tsx
Used for theme toggle:

```tsx
import { Sun, Moon } from 'lucide-react'

<Moon className="w-4 h-4" />  // Dark mode
<Sun className="w-4 h-4" />   // Light mode
```

### Home.tsx
Used for service cards and CTAs:

```tsx
import {
  Bot,           // AI Agents
  Settings,      // Automations
  Link2,         // Integrations
  Monitor,       // Full-Stack Apps
  Smartphone,    // Lead Systems
  Film,          // Content
  MessageCircle  // Email/Contact
} from 'lucide-react'

// Service headings (large)
<Bot className="w-6 h-6 text-primary" />

// Inline icons (small)
<MessageCircle className="w-4 h-4" />
```

## Standard Icon Sizes

```tsx
// Small - inline with text
className="w-4 h-4"

// Medium - section icons
className="w-5 h-5"

// Large - feature headings
className="w-6 h-6"

// Extra Large - hero sections
className="w-8 h-8"
```

## Color Classes

```tsx
// Use theme colors
className="text-primary"        // Brand color
className="text-muted-foreground"  // Subtle
className="text-success"        // Success state
className="text-destructive"    // Error state
```

## Common Patterns

### Icon with Text
```tsx
<div className="flex items-center gap-2">
  <Icon className="w-4 h-4" />
  <span>Label</span>
</div>
```

### Icon Button
```tsx
<button className="flex items-center gap-2">
  <Icon className="w-5 h-5" />
  Button Text
</button>
```

### Icon List
```tsx
<ul className="space-y-2">
  <li className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-primary" />
    <span>List item</span>
  </li>
</ul>
```

## All Available Icons in Mapping

From `src/lib/lucide-icons.ts`:

| Category | Icons |
|----------|-------|
| **Design** | Palette, Rainbow |
| **Status** | CheckCircle |
| **Docs** | Book, Library, FileText |
| **Action** | Rocket, ArrowRight, Zap |
| **Rating** | Star, Stars |
| **Dev** | Code, Package, Wrench |
| **Data** | BarChart, Type |
| **Nav** | Link, MapPin |
| **Comm** | MessageCircle |
| **Concept** | Target, Sparkles, Lightbulb |
| **Alert** | AlertTriangle |
| **Edit** | Edit |
| **Entertainment** | Tent, Drama, Film, Gamepad, Music |
| **Achievement** | Trophy, PartyPopper, Flame |
| **Nature** | Flower |
| **Devices** | Smartphone, Monitor, Laptop |
| **Theme** | Sun, Moon |

## Import Pattern

```tsx
// Import only what you need
import { Icon1, Icon2, Icon3 } from 'lucide-react'

// Or use the mapping
import { getIcon } from '@/lib/lucide-icons'
const Icon = getIcon('palette')
```

## Accessibility

Always provide context:

```tsx
// Good - accessible
<button aria-label="Toggle dark mode">
  <Moon className="w-4 h-4" />
</button>

// Better - with visible text
<button className="flex items-center gap-2">
  <Moon className="w-4 h-4" />
  <span>Dark Mode</span>
</button>
```

## Animation

Icons inherit text animations:

```tsx
<button className="hover:scale-110 transition-transform">
  <Icon className="w-5 h-5" />
</button>
```

## Responsive Sizing

```tsx
<Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
```
