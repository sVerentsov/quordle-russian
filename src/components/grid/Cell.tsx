import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'

type Props = {
  value?: string
  status?: CharStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  active?: boolean
}

export const Cell = ({
  value,
  status,
  isRevealing,
  isCompleted,
  position = 0,
}: Props) => {
  const isFilled = value && !isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`
  const isHighContrast = getStoredIsHighContrastMode()

  const classes = classnames(
    'w-[20%] h-full border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white',
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        !status,
      'border-black dark:border-slate-100': value && !status,
      'absent bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'correct bg-orange-500 text-white border-orange-500':
        status === 'correct' && isHighContrast,
      'present bg-cyan-500 text-white border-cyan-500':
        status === 'present' && isHighContrast,
      'correct bg-green-500 text-white border-green-500':
        status === 'correct' && !isHighContrast,
      'present bg-yellow-500 text-white border-yellow-500':
        status === 'present' && !isHighContrast,
      'cell-fill-animation': isFilled,
      'cell-reveal': isRevealing,
    }
  )

  return (
    <div
      className={classes}
      style={{ animationDelay: isRevealing ? animationDelay : undefined }}
    >
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}
