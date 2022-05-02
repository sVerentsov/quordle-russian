import { CHAR_COUNT } from '../../constants/settings'
import { Cell } from './Cell'

type Props = {
  hidden?: boolean
}

export const EmptyRow = ({ hidden }: Props) => {
  const emptyCells = Array.from(Array(CHAR_COUNT))

  return (
    <div className={`flex justify-center ${hidden ? 'hidden' : ''}`}>
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
