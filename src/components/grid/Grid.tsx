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

  const correctGuessLocation = guesses.findIndex((guess) => guess === solution)
  const solved = correctGuessLocation > -1
  let completedGuesses = guesses
  if (solved) {
    // if this grid is solved, ignore guesses after correct one.
    completedGuesses = guesses.slice(0, correctGuessLocation + 1)
  }
  const completedRows = completedGuesses.map((guess, i) => (
    <CompletedRow key={i} solution={solution} guess={guess} />
  ))

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
      {completedRows}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow
          solution={solution}
          guess={currentGuess}
          className={currentRowClassName}
          hidden={solved}
          isRevealing={isRevealing}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} hidden={solved} />
      ))}
    </div>
  )
}
