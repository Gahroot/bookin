/**
 * Lucide Icon Mappings
 *
 * Central reference for all icon mappings from emojis to Lucide React icons.
 * This file replaces all emoji usage throughout the application with proper
 * Lucide icons for better accessibility and consistency.
 */

import {
  Palette,
  CheckCircle,
  Book,
  Library,
  Rocket,
  Star,
  ArrowRight,
  FileText,
  Package,
  Code,
  Type,
  BarChart,
  Link,
  Target,
  Sparkles,
  Wrench,
  MapPin,
  Lightbulb,
  Zap,
  AlertTriangle,
  Edit,
  Tent,
  Rainbow,
  Drama,
  Flame,
  Stars,
  Smartphone,
  Monitor,
  Laptop,
  Film,
  Gamepad,
  Trophy,
  PartyPopper,
  Flower,
  Music,
  MessageCircle,
  Sun,
  Moon
} from 'lucide-react'

/**
 * Icon mapping object
 * Maps emoji descriptions to Lucide React icon components
 */
export const iconMap = {
  // Design & Color
  palette: Palette,           // 🎨
  rainbow: Rainbow,           // 🌈

  // Status & Checkmarks
  checkCircle: CheckCircle,   // ✅

  // Documentation
  book: Book,                 // 📖
  library: Library,           // 📚
  fileText: FileText,         // 📄, 📝

  // Action & Movement
  rocket: Rocket,             // 🚀
  arrowRight: ArrowRight,     // 👉
  zap: Zap,                   // ⚡

  // Rating & Favorites
  star: Star,                 // ⭐
  stars: Stars,               // 🌟, 💫

  // Development
  code: Code,                 // 🎣 (hooks)
  package: Package,           // 📦
  wrench: Wrench,             // 🔧

  // Data & Analytics
  barChart: BarChart,         // 📊
  type: Type,                 // 🔤

  // Navigation
  link: Link,                 // 🔗
  mapPin: MapPin,             // 📍

  // Communication
  messageCircle: MessageCircle, // 💬

  // Concepts
  target: Target,             // 🎯
  sparkles: Sparkles,         // ✨
  lightbulb: Lightbulb,       // 💡

  // Warnings & Alerts
  alertTriangle: AlertTriangle, // ⚠️

  // Editing
  edit: Edit,                 // 📝

  // Entertainment
  tent: Tent,                 // 🎪
  drama: Drama,               // 🎭
  film: Film,                 // 🎬
  gamepad: Gamepad,           // 🎮
  music: Music,               // 🎵, 🎶, 🎼

  // Achievement
  trophy: Trophy,             // 🏆
  partyPopper: PartyPopper,   // 🎉
  flame: Flame,               // 🔥

  // Nature
  flower: Flower,             // 🌸, 🌺

  // Devices
  smartphone: Smartphone,     // 📱
  monitor: Monitor,           // 🖥️
  laptop: Laptop,             // 💻

  // Theme
  sun: Sun,                   // ☀️
  moon: Moon,                 // 🌙
} as const

/**
 * Type for icon names
 */
export type IconName = keyof typeof iconMap

/**
 * Get icon component by name
 */
export function getIcon(name: IconName) {
  return iconMap[name]
}

/**
 * Default icon props for consistent sizing
 */
export const defaultIconProps = {
  size: 20,
  className: 'inline-block',
} as const

/**
 * Icon sizes
 */
export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

export type IconSize = keyof typeof iconSizes
