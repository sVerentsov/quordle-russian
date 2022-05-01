import { ReactNode } from 'react'
import classnames from 'classnames'
import { CharStatus } from '../../lib/statuses'
import { CHAR_COUNT, REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { default as tColors } from 'tailwindcss/colors'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus[]
  onClick: (value: string) => void
  isRevealing?: boolean
}

type BackgroundParams = {
  classes: string
  background: string
}

const colors: Record<CharStatus, { general: string; highContrast: string }> = {
  absent: { general: tColors.slate[400], highContrast: tColors.slate[400] },
  present: { general: tColors.yellow[500], highContrast: tColors.cyan[500] },
  correct: { general: tColors.green[500], highContrast: tColors.orange[500] },
}

const solutionIndexToClockwise = [3, 2, 0, 1]
const clockwiseToSolutionIndex = [2, 3, 1, 0] // clockwise order of words from 12 o'clock

const getColor = (status: CharStatus, isHighContrast: boolean): string => {
  const value = status || 'absent' // if status undefined, use absent
  return isHighContrast ? colors[value].highContrast : colors[value].general
}

const generateKeyBackground = (
  statuses: CharStatus[] | undefined,
  isHighContrast: boolean
): BackgroundParams => {
  if (!statuses) {
    return {
      classes:
        'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400',
      background: '',
    }
  }
  const gradients = statuses.map(
    (val, i) =>
      `${getColor(val, isHighContrast)} ${
        (360 / statuses.length) * solutionIndexToClockwise[i]
      }deg, ${getColor(val, isHighContrast)} ${
        (360 / statuses.length) * (solutionIndexToClockwise[i] + 1)
      }deg`
  )

  const orderedGradients = clockwiseToSolutionIndex.map((i) => gradients[i])

  return {
    classes: 'text-white',
    background: `conic-gradient(${orderedGradients.join(', ')})`,
  }
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  isRevealing,
}: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * CHAR_COUNT
  const isHighContrast = getStoredIsHighContrastMode()
  const { classes, background } = generateKeyBackground(status, isHighContrast)
  const divClasses = classnames(
    'flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
    classes,
    {
      'transition ease-in-out': isRevealing,
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
    width: `${width}px`,
    height: '58px',
    background: background,
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={styles}
      aria-label={`${value} ${status}`}
      className={divClasses}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
