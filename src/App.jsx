import { useEffect, useState } from 'react'
import { StoreProvider } from './data/store'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Subjects } from './pages/Subjects'
import { SubjectDetail } from './pages/SubjectDetail'
import { Tasks } from './pages/Tasks'
import { Goals } from './pages/Goals'
import { CalendarPage } from './pages/Calendar'

function useHashPath() {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/')
  useEffect(() => {
    const onHash = () => setPath(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return path
}

function Screen({ path }) {
  if (path.startsWith('/subjects/')) {
    return <SubjectDetail id={path.slice('/subjects/'.length)} />
  }
  switch (path) {
    case '/subjects':
      return <Subjects />
    case '/tasks':
      return <Tasks />
    case '/goals':
      return <Goals />
    case '/calendar':
      return <CalendarPage />
    default:
      return <Dashboard />
  }
}

export default function App() {
  const path = useHashPath()
  return (
    <StoreProvider>
      <Layout path={path}>
        <Screen path={path} />
      </Layout>
    </StoreProvider>
  )
}
