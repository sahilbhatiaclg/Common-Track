import { greeting, todayISO, formatDay, formatLongDay } from '../data/dates'
import { allSubjectProgress, dailyProgress, upcoming, weeklyTaskProgress } from '../data/progress'
import { useStore } from '../data/store'
import { Card, EmptyState, ProgressBar, SectionLabel } from '../components/ui'
import { GoalRow, TaskRow } from '../components/Rows'

export function Dashboard() {
  const { state, dispatch } = useStore()
  const today = todayISO()
  const day = dailyProgress(state, today)
  const week = weeklyTaskProgress(state, today)
  const subjects = allSubjectProgress(state)
  const todayTasks = state.tasks.filter((t) => t.date === today)
  const todayGoals = state.goals.filter((g) => g.date === today)
  const coming = upcoming(state, today)
  const name = state.preferences.displayName.trim()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">
          {greeting()}
          {name ? `, ${name}` : ''}
        </h1>
        <p className="mt-1 text-[0.8rem] text-ink-soft">{formatLongDay(today)}</p>
      </div>

      <Card>
        <ProgressBar
          value={day.percent}
          label={`Today · ${day.done}/${day.total || 0} items`}
        />
        <p className="mt-2.5 text-[0.75rem] text-ink-soft">
          Tasks {day.taskDone}/{day.taskTotal}
          {' · '}
          Goals {day.goalDone}/{day.goalTotal}
          {week.total ? ` · This week ${week.done}/${week.total} tasks` : ''}
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionLabel>Today's tasks</SectionLabel>
          {todayTasks.length === 0 ? (
            <EmptyState title="Nothing planned for today" hint="Add a task from Tasks or turn a topic into one." />
          ) : (
            todayTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                subjectName={state.subjects.find((s) => s.id === task.subjectId)?.name}
                onToggle={() => dispatch({ type: 'toggleTask', id: task.id })}
              />
            ))
          )}
        </Card>

        <Card>
          <SectionLabel>Daily goals</SectionLabel>
          {todayGoals.length === 0 ? (
            <EmptyState title="No goals for today" hint="Goals belong to a single date. Create tomorrow's when you plan." />
          ) : (
            todayGoals.map((goal) => (
              <GoalRow
                key={goal.id}
                goal={goal}
                subjectName={state.subjects.find((s) => s.id === goal.subjectId)?.name}
                onBump={(delta) => dispatch({ type: 'bumpGoal', id: goal.id, delta })}
              />
            ))
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-3">
          <SectionLabel>Subject progress</SectionLabel>
        </div>
        {subjects.length === 0 ? (
          <EmptyState title="Add your first subject" hint="Progress is counted from completed topics." />
        ) : (
          <div className="space-y-4">
            {subjects.map(({ subject, percent: p, done, total }) => (
              <a key={subject.id} href={`#/subjects/${subject.id}`} className="block no-underline">
                <ProgressBar
                  value={p}
                  label={`${subject.name}${subject.term ? ` · ${subject.term}` : ''} · ${done}/${total}`}
                />
              </a>
            ))}
          </div>
        )}
      </Card>

      {!name ? (
        <p className="text-[0.8rem] text-ink-soft">
          Optional:{' '}
          <button
            type="button"
            className="text-accent underline"
            onClick={() => {
              const value = window.prompt('What should we call you?')
              if (value) dispatch({ type: 'setName', name: value })
            }}
          >
            add your name
          </button>{' '}
          for the greeting.
        </p>
      ) : null}

      <Card>
        <SectionLabel>Upcoming</SectionLabel>
        {coming.length === 0 ? (
          <EmptyState title="No upcoming work" hint="Open dates on the calendar to plan ahead." />
        ) : (
          coming.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="flex justify-between gap-3 border-b border-line py-2 last:border-0">
              <span className="text-[0.85rem]">{item.title}</span>
              <span className="shrink-0 text-[0.75rem] text-ink-soft">{formatDay(item.date)}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
