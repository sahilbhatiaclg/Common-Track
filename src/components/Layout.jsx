import { useStore } from '../data/store'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#/', label: 'Dashboard' },
  { href: '#/subjects', label: 'Subjects' },
  { href: '#/tasks', label: 'Tasks' },
  { href: '#/goals', label: 'Goals' },
  { href: '#/calendar', label: 'Calendar' },
]

export function Layout({ path, children }) {
  const { state, dispatch } = useStore()
  const theme = state.preferences.theme === 'dark' ? 'dark' : 'light'
  const toggleTheme = () => dispatch({ type: 'setTheme', theme: theme === 'dark' ? 'light' : 'dark' })

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <a href="#/" className="no-underline">
              <p className="text-[1.35rem] leading-none font-normal tracking-wide text-ink sm:text-[1.5rem]">
                COMMON TRACK
              </p>
              <p className="mt-1.5 text-[0.65rem] tracking-wide text-ink-soft uppercase">
                Study more. Manage less.
              </p>
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <nav className="mt-3 flex flex-wrap gap-0.5">
            {links.map((link) => {
              const active =
                link.href === '#/'
                  ? path === '/'
                  : path.startsWith(link.href.slice(1))
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-2.5 py-1 text-[0.75rem] no-underline ${
                    active ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
