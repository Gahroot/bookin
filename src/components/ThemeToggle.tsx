'use client'

export const THEME_KEY = 'ng_theme'

/** Runs before paint (inlined in <head>) so a saved theme never flashes. */
export const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const current =
      root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="glass-control inline-flex size-11 items-center justify-center rounded-full text-ink"
      aria-label="Toggle light or dark theme"
    >
      <svg
        className="theme-light-only size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        className="theme-dark-only size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  )
}
