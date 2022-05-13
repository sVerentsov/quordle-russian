import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  solution: string
  guess: string
  hidden: boolean
}

export const CompletedRow = ({ solution, guess, hidden }: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className={`flex justify-center text-xs ${hidden ? 'invisible' : ''}`}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} isCompleted />
      ))}
    </div>
  )
}
