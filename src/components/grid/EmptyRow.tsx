import { CHAR_COUNT } from '../../constants/settings'
import { Cell } from './Cell'

export const EmptyRow = () => {
  const emptyCells = Array.from(Array(CHAR_COUNT))

  return (
    <div className="flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
