import { useState } from 'react'
import { allSubjectProgress } from '../data/progress'
import { useStore } from '../data/store'
import { Card, EmptyState, Field, PrimaryButton, ProgressBar, TextInput } from '../components/ui'

export function Subjects() {
  const { state, dispatch } = useStore()
  const [name, setName] = useState('')
  const [term, setTerm] = useState('')
  const rows = allSubjectProgress(state)

  function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    dispatch({ type: 'addSubject', name, term })
    setName('')
    setTerm('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">Subjects</h1>
        <p className="mt-1 text-[0.8rem] text-ink-soft">Units are optional. Topics can sit directly under a subject.</p>
      </div>

      <Card>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
          <Field label="Subject">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Computer Networks" />
          </Field>
          <Field label="Term (optional)">
            <TextInput value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Odd 2026" />
          </Field>
          <PrimaryButton type="submit">Add</PrimaryButton>
        </form>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="No subjects yet" hint="Add the papers you are taking this term." />
      ) : (
        <div className="grid gap-3">
          {rows.map(({ subject, percent, done, total }) => (
            <a
              key={subject.id}
              href={`#/subjects/${subject.id}`}
              className="block rounded-xl border border-line bg-paper p-4 no-underline hover:border-accent"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h2 className="text-base font-normal">{subject.name}</h2>
                {subject.term ? <span className="text-[0.75rem] text-ink-soft">{subject.term}</span> : null}
              </div>
              <ProgressBar value={percent} label={`${done}/${total} topics`} />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
