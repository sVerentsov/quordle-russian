import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  solution: string
  guess: string
}

export const CompletedRow = ({ solution, guess }: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="flex justify-center text-xs">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} isCompleted />
      ))}
    </div>
  )
}
