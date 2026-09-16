export function percent(done, total) {
  if (!total) return null
  return Math.round((done / total) * 100)
}

export function subjectProgress(state, subjectId) {
  const topics = state.topics.filter((t) => t.subjectId === subjectId)
  const done = topics.filter((t) => t.completed).length
  return { done, total: topics.length, percent: percent(done, topics.length) }
}

export function allSubjectProgress(state) {
  return state.subjects.map((subject) => ({
    subject,
    ...subjectProgress(state, subject.id),
  }))
}

export function itemsOnDate(state, iso) {
  return {
    tasks: state.tasks.filter((t) => t.date === iso),
    goals: state.goals.filter((g) => g.date === iso),
    events: state.events.filter((e) => e.date === iso),
  }
}

export function dailyProgress(state, iso) {
  const { tasks, goals } = itemsOnDate(state, iso)
  const taskDone = tasks.filter((t) => t.completed).length
  const goalDone = goals.filter((g) => g.current >= g.target && g.target > 0).length
  const total = tasks.length + goals.length
  const done = taskDone + goalDone
  return {
    taskDone,
    taskTotal: tasks.length,
    goalDone,
    goalTotal: goals.length,
    done,
    total,
    percent: percent(done, total),
  }
}

export function upcoming(state, fromIso, days = 14) {
  const items = []
  for (const task of state.tasks) {
    if (!task.completed && task.date >= fromIso) {
      items.push({ kind: 'task', date: task.date, title: task.title, id: task.id })
    }
  }
  for (const event of state.events) {
    if (event.date >= fromIso) {
      items.push({ kind: 'event', date: event.date, title: event.title, id: event.id })
    }
  }
  items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
  const cutoff = addDaysLocal(fromIso, days)
  return items.filter((item) => item.date <= cutoff).slice(0, 8)
}

function addDaysLocal(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + n)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function weeklyTaskProgress(state, fromIso) {
  const [y, m, d] = fromIso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  const startIso = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const endIso = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  const tasks = state.tasks.filter((t) => t.date >= startIso && t.date <= endIso)
  const done = tasks.filter((t) => t.completed).length
  return { done, total: tasks.length, percent: percent(done, tasks.length), startIso, endIso }
}
