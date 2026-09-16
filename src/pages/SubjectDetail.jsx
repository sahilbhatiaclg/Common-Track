import { useState } from 'react'
import { todayISO } from '../data/dates'
import { subjectProgress } from '../data/progress'
import { useStore } from '../data/store'
import { Card, Checkbox, EmptyState, Field, GhostButton, PrimaryButton, ProgressBar, TextInput } from '../components/ui'

export function SubjectDetail({ id }) {
  const { state, dispatch } = useStore()
  const subject = state.subjects.find((s) => s.id === id)
  const [editName, setEditName] = useState('')
  const [editTerm, setEditTerm] = useState('')
  const [editing, setEditing] = useState(false)
  const [unitName, setUnitName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [topicUnit, setTopicUnit] = useState('')

  if (!subject) {
    return (
      <div>
        <h1 className="text-2xl font-normal">Subject not found</h1>
        <a href="#/subjects" className="mt-3 inline-block text-accent">
          Back to subjects
        </a>
      </div>
    )
  }

  const units = state.units.filter((u) => u.subjectId === id)
  const topics = state.topics.filter((t) => t.subjectId === id)
  const ungrouped = topics.filter((t) => !t.unitId)
  const progress = subjectProgress(state, id)

  function startEdit() {
    setEditName(subject.name)
    setEditTerm(subject.term)
    setEditing(true)
  }

  function saveEdit(e) {
    e.preventDefault()
    dispatch({ type: 'updateSubject', id, name: editName, term: editTerm })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <a href="#/subjects" className="text-[0.75rem] text-ink-soft no-underline hover:text-ink">
            ← Subjects
          </a>
          <h1 className="mt-1.5 text-2xl font-normal tracking-tight">{subject.name}</h1>
          {subject.term ? <p className="text-[0.8rem] text-ink-soft">{subject.term}</p> : null}
        </div>
        <div className="flex gap-2">
          <GhostButton onClick={startEdit}>Edit</GhostButton>
          <GhostButton
            onClick={() => {
              if (confirm(`Delete ${subject.name}? Topics for this subject will be removed.`)) {
                dispatch({ type: 'deleteSubject', id })
                window.location.hash = '#/subjects'
              }
            }}
          >
            Delete
          </GhostButton>
        </div>
      </div>

      {editing ? (
        <Card>
          <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={editName} onChange={(e) => setEditName(e.target.value)} />
            </Field>
            <Field label="Term">
              <TextInput value={editTerm} onChange={(e) => setEditTerm(e.target.value)} />
            </Field>
            <div className="flex gap-2">
              <PrimaryButton type="submit">Save</PrimaryButton>
              <GhostButton onClick={() => setEditing(false)}>Cancel</GhostButton>
            </div>
          </form>
        </Card>
      ) : null}

      <Card>
        <ProgressBar value={progress.percent} label={`${progress.done}/${progress.total} topics complete`} />
      </Card>

      <Card>
        <h2 className="mb-2 text-[0.68rem] font-normal tracking-[0.16em] text-ink-soft uppercase">Add structure</h2>
        <form
          className="mb-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!unitName.trim()) return
            dispatch({ type: 'addUnit', subjectId: id, name: unitName })
            setUnitName('')
          }}
        >
          <TextInput value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Unit name (optional grouping)" />
          <PrimaryButton type="submit">Add unit</PrimaryButton>
        </form>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!topicName.trim()) return
            dispatch({
              type: 'addTopic',
              subjectId: id,
              unitId: topicUnit || null,
              name: topicName,
            })
            setTopicName('')
          }}
        >
          <TextInput value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic, e.g. OSI Model" />
          <select
            value={topicUnit}
            onChange={(e) => setTopicUnit(e.target.value)}
            className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[0.85rem]"
          >
            <option value="">No unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <PrimaryButton type="submit">Add topic</PrimaryButton>
        </form>
      </Card>

      {topics.length === 0 && units.length === 0 ? (
        <EmptyState title="No topics yet" hint="Add topics to track syllabus completion automatically." />
      ) : (
        <div className="space-y-4">
          {ungrouped.length > 0 || units.length === 0 ? (
            <TopicList
              title="Topics"
              topics={ungrouped}
              dispatch={dispatch}
            />
          ) : null}
          {units.map((unit) => (
            <TopicList
              key={unit.id}
              title={unit.name}
              topics={topics.filter((t) => t.unitId === unit.id)}
              dispatch={dispatch}
              onDeleteUnit={() => dispatch({ type: 'deleteUnit', id: unit.id })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TopicList({ title, topics, dispatch, onDeleteUnit }) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-normal">{title}</h2>
        {onDeleteUnit ? (
          <GhostButton onClick={onDeleteUnit}>Remove unit</GhostButton>
        ) : null}
      </div>
      {topics.length === 0 ? (
        <p className="text-[0.8rem] text-ink-soft">No topics in this unit.</p>
      ) : (
        topics.map((topic) => (
          <div key={topic.id} className="flex items-center gap-2.5 border-b border-line py-2 last:border-0">
            <Checkbox
              checked={topic.completed}
              onClick={() => dispatch({ type: 'toggleTopic', id: topic.id })}
              label={topic.completed ? 'Mark topic incomplete' : 'Mark topic complete'}
            />
            <span className={`flex-1 text-[0.85rem] ${topic.completed ? 'text-ink-soft line-through' : ''}`}>{topic.name}</span>
            <button
              type="button"
              className="text-[0.68rem] text-accent hover:underline"
              onClick={() => dispatch({ type: 'topicToTask', topicId: topic.id, date: todayISO() })}
            >
              Study today
            </button>
            <button
              type="button"
              className="text-[0.68rem] text-ink-soft hover:text-ink"
              onClick={() => dispatch({ type: 'deleteTopic', id: topic.id })}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </Card>
  )
}
