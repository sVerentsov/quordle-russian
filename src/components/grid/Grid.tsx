import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  return (
    <div
      className="pb-2 h-1/2 grid gap-y-px"
      style={{
        gridTemplateRows:
          (guesses.length ? `repeat(${guesses.length}, auto) ` : '') +
          '3rem' +
          (empties.length ? ` repeat(${empties.length}, auto)` : ''),
      }}
    >
      {guesses.map((guess, i) => (
        <CompletedRow key={i} solution={solution} guess={guess} />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow
          solution={solution}
          guess={currentGuess}
          className={currentRowClassName}
          isRevealing={isRevealing}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  )
}
