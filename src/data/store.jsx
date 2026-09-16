import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadState, newId, saveState } from './state'

const StoreContext = createContext(null)

function syncTopicFromTask(state, topicId, completed) {
  if (!topicId) return state.topics
  return state.topics.map((topic) =>
    topic.id === topicId ? { ...topic, completed } : topic,
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'setName':
      return { ...state, preferences: { ...state.preferences, displayName: action.name } }

    case 'setTheme':
      return {
        ...state,
        preferences: { ...state.preferences, theme: action.theme === 'dark' ? 'dark' : 'light' },
      }

    case 'addSubject':
      return {
        ...state,
        subjects: [
          ...state.subjects,
          {
            id: newId(),
            name: action.name.trim(),
            term: action.term?.trim() || '',
            createdAt: Date.now(),
          },
        ],
      }

    case 'updateSubject':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.id ? { ...s, name: action.name.trim(), term: action.term?.trim() || '' } : s,
        ),
      }

    case 'deleteSubject': {
      const id = action.id
      return {
        ...state,
        subjects: state.subjects.filter((s) => s.id !== id),
        units: state.units.filter((u) => u.subjectId !== id),
        topics: state.topics.filter((t) => t.subjectId !== id),
        tasks: state.tasks.map((t) => (t.subjectId === id ? { ...t, subjectId: null, topicId: null } : t)),
        goals: state.goals.map((g) => (g.subjectId === id ? { ...g, subjectId: null } : g)),
        events: state.events.map((e) => (e.subjectId === id ? { ...e, subjectId: null } : e)),
      }
    }

    case 'addUnit': {
      const siblings = state.units.filter((u) => u.subjectId === action.subjectId)
      return {
        ...state,
        units: [
          ...state.units,
          {
            id: newId(),
            subjectId: action.subjectId,
            name: action.name.trim(),
            order: siblings.length,
          },
        ],
      }
    }

    case 'deleteUnit':
      return {
        ...state,
        units: state.units.filter((u) => u.id !== action.id),
        topics: state.topics.map((t) => (t.unitId === action.id ? { ...t, unitId: null } : t)),
      }

    case 'addTopic': {
      const siblings = state.topics.filter(
        (t) => t.subjectId === action.subjectId && t.unitId === (action.unitId || null),
      )
      return {
        ...state,
        topics: [
          ...state.topics,
          {
            id: newId(),
            subjectId: action.subjectId,
            unitId: action.unitId || null,
            name: action.name.trim(),
            completed: false,
            order: siblings.length,
          },
        ],
      }
    }

    case 'toggleTopic': {
      const topic = state.topics.find((t) => t.id === action.id)
      if (!topic) return state
      const completed = !topic.completed
      return {
        ...state,
        topics: state.topics.map((t) => (t.id === action.id ? { ...t, completed } : t)),
        tasks: state.tasks.map((task) =>
          task.topicId === action.id ? { ...task, completed } : task,
        ),
      }
    }

    case 'deleteTopic':
      return {
        ...state,
        topics: state.topics.filter((t) => t.id !== action.id),
        tasks: state.tasks.map((task) =>
          task.topicId === action.id ? { ...task, topicId: null } : task,
        ),
      }

    case 'addTask':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: newId(),
            title: action.title.trim(),
            subjectId: action.subjectId || null,
            topicId: action.topicId || null,
            date: action.date,
            completed: false,
            createdAt: Date.now(),
          },
        ],
      }

    case 'updateTask':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                title: action.title.trim(),
                subjectId: action.subjectId || null,
                date: action.date,
              }
            : t,
        ),
      }

    case 'toggleTask': {
      const task = state.tasks.find((t) => t.id === action.id)
      if (!task) return state
      const completed = !task.completed
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, completed } : t)),
        topics: syncTopicFromTask(state, task.topicId, completed),
      }
    }

    case 'deleteTask':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }

    case 'topicToTask': {
      const topic = state.topics.find((t) => t.id === action.topicId)
      if (!topic) return state
      const exists = state.tasks.some((t) => t.topicId === topic.id && t.date === action.date)
      if (exists) return state
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: newId(),
            title: `Study ${topic.name}`,
            subjectId: topic.subjectId,
            topicId: topic.id,
            date: action.date,
            completed: topic.completed,
            createdAt: Date.now(),
          },
        ],
      }
    }

    case 'addGoal':
      return {
        ...state,
        goals: [
          ...state.goals,
          {
            id: newId(),
            title: action.title.trim(),
            subjectId: action.subjectId || null,
            date: action.date,
            target: Number(action.target) || 1,
            current: 0,
            createdAt: Date.now(),
          },
        ],
      }

    case 'setGoalCurrent':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, current: Math.max(0, Math.min(g.target, Number(action.current))) }
            : g,
        ),
      }

    case 'bumpGoal':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, current: Math.max(0, Math.min(g.target, g.current + action.delta)) }
            : g,
        ),
      }

    case 'deleteGoal':
      return { ...state, goals: state.goals.filter((g) => g.id !== action.id) }

    case 'addEvent':
      return {
        ...state,
        events: [
          ...state.events,
          {
            id: newId(),
            title: action.title.trim(),
            date: action.date,
            kind: action.kind || 'event',
            subjectId: action.subjectId || null,
          },
        ],
      }

    case 'deleteEvent':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const dark = state.preferences.theme === 'dark'
    document.documentElement.classList.toggle('dark', dark)
  }, [state.preferences.theme])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function useSubject(id) {
  const { state } = useStore()
  return state.subjects.find((s) => s.id === id) || null
}
