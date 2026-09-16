export function ProgressBar({ value, label }) {
  const width = value == null ? 0 : Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-[0.8rem]">
        {label ? <span className="text-ink">{label}</span> : <span />}
        <span className="text-ink-soft tabular-nums">{value == null ? '—' : `${width}%`}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-paper-2/50 px-4 py-6 text-center">
      <p className="text-[0.9rem] font-normal text-ink">{title}</p>
      {hint ? <p className="mt-1 text-[0.75rem] text-ink-soft">{hint}</p> : null}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.7rem] tracking-[0.04em] text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[0.85rem] outline-none focus:border-accent ${props.className || ''}`}
    />
  )
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[0.85rem] outline-none focus:border-accent ${props.className || ''}`}
    />
  )
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      type={props.type || 'button'}
      {...props}
      className="rounded-lg bg-accent px-3 py-1.5 text-[0.8rem] font-normal text-paper hover:bg-accent-2 disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      type={props.type || 'button'}
      {...props}
      className="rounded-lg px-2 py-1 text-[0.75rem] text-ink-soft hover:bg-paper-2 hover:text-ink"
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <section className={`rounded-xl border border-line bg-paper p-4 shadow-[0_1px_0_color-mix(in_srgb,var(--color-ink)_6%,transparent)] ${className}`}>
      {children}
    </section>
  )
}

export function Checkbox({ checked, onClick, label, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] border text-[0.6rem] leading-none ${
        checked ? 'border-accent bg-accent text-paper' : 'border-ink-soft'
      } ${className}`}
    >
      {checked ? '✓' : ''}
    </button>
  )
}

export function SectionLabel({ children, className = '' }) {
  return (
    <h2 className={`mb-1 text-[0.68rem] font-normal tracking-[0.16em] text-ink-soft uppercase ${className}`}>
      {children}
    </h2>
  )
}
