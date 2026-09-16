import { useMemo, useState } from 'react'
import { formatLongDay, monthGrid, todayISO } from '../data/dates'
import { itemsOnDate } from '../data/progress'
import { useStore } from '../data/store'
import { Card, EmptyState, Field, PrimaryButton, SectionLabel, Select, TextInput } from '../components/ui'
import { GoalRow, TaskRow } from '../components/Rows'

export function CalendarPage() {
  const { state, dispatch } = useStore()
  const today = todayISO()
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selected, setSelected] = useState(today)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('deadline')
  const [subjectId, setSubjectId] = useState('')

  const cells = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor])
  const label = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const day = itemsOnDate(state, selected)

  function addEvent(e) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({ type: 'addEvent', title, date: selected, kind, subjectId: subjectId || null })
    setTitle('')
  }

  function shift(delta) {
    const d = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">Calendar</h1>
        <p className="mt-1 text-[0.8rem] text-ink-soft">The same tasks and goals you see on the dashboard.</p>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" className="rounded-md px-2 py-0.5 text-sm hover:bg-paper-2" onClick={() => shift(-1)}>
            ←
          </button>
          <h2 className="text-sm font-normal">{label}</h2>
          <button type="button" className="rounded-md px-2 py-0.5 text-sm hover:bg-paper-2" onClick={() => shift(1)}>
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] text-ink-soft">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} />
            const items = itemsOnDate(state, cell.iso)
            const count = items.tasks.length + items.goals.length + items.events.length
            const isToday = cell.iso === today
            const isSelected = cell.iso === selected
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelected(cell.iso)}
                className={`min-h-11 rounded-lg p-1 text-[0.8rem] ${
                  isSelected ? 'bg-ink text-paper' : isToday ? 'bg-paper-2' : 'hover:bg-paper-2'
                }`}
              >
                <span className="block">{cell.day}</span>
                {count ? (
                  <span className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-paper' : 'bg-accent'}`} />
                ) : null}
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-normal">{formatLongDay(selected)}</h2>
        <form onSubmit={addEvent} className="my-4 grid gap-3 md:grid-cols-[1fr_9rem_12rem_auto] md:items-end">
          <Field label="Academic event">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CN assignment" />
          </Field>
          <Field label="Type">
            <Select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="deadline">Deadline</option>
              <option value="event">Event</option>
              <option value="plan">Study plan</option>
            </Select>
          </Field>
          <Field label="Subject">
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">None</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <PrimaryButton type="submit">Add</PrimaryButton>
        </form>

        <SectionLabel className="mt-5">Tasks</SectionLabel>
        {day.tasks.length === 0 ? (
          <p className="py-2 text-[0.8rem] text-ink-soft">No tasks.</p>
        ) : (
          day.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              subjectName={state.subjects.find((s) => s.id === task.subjectId)?.name}
              onToggle={() => dispatch({ type: 'toggleTask', id: task.id })}
              onDelete={() => dispatch({ type: 'deleteTask', id: task.id })}
            />
          ))
        )}

        <SectionLabel className="mt-5">Goals</SectionLabel>
        {day.goals.length === 0 ? (
          <p className="py-2 text-[0.8rem] text-ink-soft">No goals.</p>
        ) : (
          day.goals.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              subjectName={state.subjects.find((s) => s.id === goal.subjectId)?.name}
              onBump={(delta) => dispatch({ type: 'bumpGoal', id: goal.id, delta })}
              onDelete={() => dispatch({ type: 'deleteGoal', id: goal.id })}
            />
          ))
        )}

        <SectionLabel className="mt-5">Events</SectionLabel>
        {day.events.length === 0 ? (
          <EmptyState title="No academic events" />
        ) : (
          day.events.map((event) => (
            <div key={event.id} className="flex items-center justify-between border-b border-line py-2 last:border-0">
              <div>
                <p className="text-[0.85rem]">{event.title}</p>
                <p className="text-[0.68rem] text-ink-soft capitalize">{event.kind}</p>
              </div>
              <button
                type="button"
                className="text-[0.68rem] text-ink-soft hover:text-ink"
                onClick={() => dispatch({ type: 'deleteEvent', id: event.id })}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
