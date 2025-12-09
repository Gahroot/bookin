/**
 * Web Vitals Measurement Utilities
 */

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  entries: PerformanceEntry[]
}

type WebVitalCallback = (metric: WebVitalMetric) => void

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export function measureLCP(callback: WebVitalCallback): void {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      callback({
        name: 'LCP',
        value: lastEntry.startTime,
        rating: getRating('LCP', lastEntry.startTime),
        delta: lastEntry.startTime,
        id: 'lcp',
        entries: [lastEntry],
      })
    })

    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (error) {
    console.error('Error measuring LCP:', error)
  }
}

export function measureCLS(callback: WebVitalCallback): void {
  if (!('PerformanceObserver' in window)) return

  let clsValue = 0
  const clsEntries: PerformanceEntry[] = []

  // Layout Shift entries have additional properties not in PerformanceEntry
  interface LayoutShift extends PerformanceEntry {
    hadRecentInput: boolean
    value: number
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as LayoutShift
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value
          clsEntries.push(entry)
        }
      }

      callback({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: 'cls',
        entries: clsEntries,
      })
    })

    observer.observe({ type: 'layout-shift', buffered: true })
  } catch (error) {
    console.error('Error measuring CLS:', error)
  }
}

export function measureFCP(callback: WebVitalCallback): void {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          callback({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
            delta: entry.startTime,
            id: 'fcp',
            entries: [entry],
          })
          observer.disconnect()
        }
      }
    })

    observer.observe({ type: 'paint', buffered: true })
  } catch (error) {
    console.error('Error measuring FCP:', error)
  }
}

export function initWebVitals(callback: WebVitalCallback): void {
  measureLCP(callback)
  measureCLS(callback)
  measureFCP(callback)
}

export function logWebVitals(): void {
  initWebVitals((metric) => {
    const valueStr = metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value) + 'ms'
    console.log('[Web Vitals]', metric.name + ':', valueStr, '(' + metric.rating + ')')
  })
}
