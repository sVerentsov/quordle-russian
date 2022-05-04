import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { CHAR_COUNT } from '../../constants/settings'
import { getGuessStatuses } from '../../lib/statuses'

type Props = {
  guess: string
  className: string
  solution: string
  isRevealing?: boolean
  hidden?: boolean
}

export const CurrentRow = ({
  solution,
  guess,
  className,
  isRevealing,
  hidden,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(CHAR_COUNT - splitGuess.length))
  const classes = `flex justify-center text-3xl ${
    hidden ? 'invisible' : ''
  } ${className}`
  const statuses =
    guess.length === CHAR_COUNT && isRevealing
      ? getGuessStatuses(solution, guess)
      : null
  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          isRevealing={isRevealing}
          position={i}
          status={statuses?.[i]}
        />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} isRevealing={isRevealing} />
      ))}
    </div>
  )
}
