import { formatDay } from '../data/dates'
import { Checkbox, GhostButton } from './ui'

export function TaskRow({ task, subjectName, onToggle, onDelete }) {
  return (
    <div className="flex items-start gap-2.5 border-b border-line py-2 last:border-0">
      <Checkbox
        className="mt-0.5"
        checked={task.completed}
        onClick={onToggle}
        label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[0.85rem] ${task.completed ? 'text-ink-soft line-through' : 'text-ink'}`}>
          {task.title}
        </p>
        <p className="text-[0.68rem] text-ink-soft">
          {formatDay(task.date)}
          {subjectName ? ` · ${subjectName}` : ''}
        </p>
      </div>
      {onDelete ? (
        <GhostButton onClick={onDelete} aria-label="Delete task">
          Delete
        </GhostButton>
      ) : null}
    </div>
  )
}

export function GoalRow({ goal, subjectName, onBump, onDelete }) {
  const done = goal.current >= goal.target
  return (
    <div className="flex items-center gap-2.5 border-b border-line py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className={`text-[0.85rem] ${done ? 'text-ink-soft' : 'text-ink'}`}>
          {done ? '✓ ' : ''}
          {goal.title}
        </p>
        <p className="text-[0.68rem] text-ink-soft">
          {goal.current}/{goal.target}
          {subjectName ? ` · ${subjectName}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="rounded-md px-1.5 py-0.5 text-sm leading-none hover:bg-paper-2"
          onClick={() => onBump(-1)}
        >
          −
        </button>
        <button
          type="button"
          className="rounded-md px-1.5 py-0.5 text-sm leading-none hover:bg-paper-2"
          onClick={() => onBump(1)}
        >
          +
        </button>
        {onDelete ? (
          <button type="button" className="ml-1 text-[0.68rem] text-ink-soft hover:text-ink" onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  )
}
