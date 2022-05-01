import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Как играть" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Угадайте все 4 загаданных слова с 9 попыток. После каждой попытки цвет
        букв будет меняться, чтобы показать, какие буквы есть в загаданном
        слове!
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell isRevealing isCompleted value="С" status="present" />
        <Cell value="П" isRevealing isCompleted status="absent" />
        <Cell value="О" isRevealing isCompleted status="absent" />
        <Cell value="Р" isRevealing isCompleted status="present" />
        <Cell value="Т" isRevealing isCompleted status="correct" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Буква Т присутствует в слове и находится на правильной позиции. Буквы С
        и Р тоже есть в слове, но С - не на первой позиции, а Р - не на
        четвёртой. Букв П и О нет в искомом слове.
      </p>

      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        Оригинальная игра -{' '}
        <a href="https://quordle.com" className="underline">
          Quordle
        </a>
        . Исходный код этой версии можно найти{' '}
        <a
          href="https://github.com/sVerentsov/react-wordle"
          className="underline font-bold"
        >
          здесь
        </a>
        {'. '}
      </p>
    </BaseModal>
  )
}
