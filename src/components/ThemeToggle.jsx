function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 13.5A7 7 0 0 1 10.5 4a7.5 7.5 0 1 0 8.7 10.7 6.2 6.2 0 0 1-2.7-1.2z"
      />
    </svg>
  )
}

export function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className="relative z-0 inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-line bg-paper-2 p-0.5 transition-colors"
    >
      <span
        className={`absolute top-0.5 left-0.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-paper text-ink shadow-[0_1px_3px_color-mix(in_srgb,var(--color-ink)_16%,transparent)] transition-transform duration-200 ${
          dark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="grid w-full grid-cols-2 text-ink-soft">
        <span className="grid place-items-center">
          <SunIcon />
        </span>
        <span className="grid place-items-center">
          <MoonIcon />
        </span>
      </span>
    </button>
  )
}
