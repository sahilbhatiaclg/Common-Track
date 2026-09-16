import { useState } from 'react'
import { todayISO } from '../data/dates'
import { useStore } from '../data/store'
import { Card, EmptyState, Field, PrimaryButton, Select, TextInput } from '../components/ui'
import { GoalRow } from '../components/Rows'

export function Goals() {
  const { state, dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [target, setTarget] = useState(2)
  const [subjectId, setSubjectId] = useState('')

  const sorted = [...state.goals].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  function add(e) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({ type: 'addGoal', title, date, target, subjectId: subjectId || null })
    setTitle('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">Daily goals</h1>
        <p className="mt-1 text-[0.8rem] text-ink-soft">Each goal is for one date. Create a new one tomorrow if you still need it.</p>
      </div>

      <Card>
        <form onSubmit={add} className="grid gap-3 md:grid-cols-[1fr_8rem_10rem_12rem_auto] md:items-end">
          <Field label="Goal">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Solve DSA problems" />
          </Field>
          <Field label="Target">
            <TextInput type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
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
          <EmptyState title="No goals yet" hint="Example: DSA — 2 problems." />
        ) : (
          sorted.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              subjectName={state.subjects.find((s) => s.id === goal.subjectId)?.name}
              onBump={(delta) => dispatch({ type: 'bumpGoal', id: goal.id, delta })}
              onDelete={() => dispatch({ type: 'deleteGoal', id: goal.id })}
            />
          ))
        )}
      </Card>
    </div>
  )
}
