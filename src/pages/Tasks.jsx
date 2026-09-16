import { useState } from 'react'
import { todayISO } from '../data/dates'
import { useStore } from '../data/store'
import { Card, EmptyState, Field, PrimaryButton, Select, TextInput } from '../components/ui'
import { TaskRow } from '../components/Rows'

export function Tasks() {
  const { state, dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [subjectId, setSubjectId] = useState('')

  const sorted = [...state.tasks].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)

  function add(e) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({ type: 'addTask', title, date, subjectId: subjectId || null })
    setTitle('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">Tasks</h1>
        <p className="mt-1 text-[0.8rem] text-ink-soft">One list. Completing a linked task also completes its topic.</p>
      </div>

      <Card>
        <form onSubmit={add} className="grid gap-3 md:grid-cols-[1fr_10rem_12rem_auto] md:items-end">
          <Field label="Task">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Revise COA" />
          </Field>
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
      </Card>

      <Card>
        {sorted.length === 0 ? (
          <EmptyState title="No tasks" hint="Keep this short. Today's work should fit on one screen." />
        ) : (
          sorted.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              subjectName={state.subjects.find((s) => s.id === task.subjectId)?.name}
              onToggle={() => dispatch({ type: 'toggleTask', id: task.id })}
              onDelete={() => dispatch({ type: 'deleteTask', id: task.id })}
            />
          ))
        )}
      </Card>
    </div>
  )
}
