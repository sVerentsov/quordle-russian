import { GameMode } from '../lib/modes'

export const GAME_TITLE = 'Quordle RU'

export const WIN_MESSAGES = ['Отлично!', 'Хорошая работа', 'Неплохо!']
export const GAME_COPIED_MESSAGE = 'Скопировано в буфер обмена'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Недостаточно букв'
export const WORD_NOT_FOUND_MESSAGE = 'Этого слова нет в словаре'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'Для лучшего распознавания цветов'
export const CORRECT_WORD_MESSAGE = (solutions: string[]) =>
  `Правильные слова – ${solutions.join(', ')}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Нужно использовать ${guess} на позиции ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `В слове должна быть буква ${letter}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Удалить'
export const STATISTICS_TITLE = 'Статистика'
export const GUESS_DISTRIBUTION_TEXT = 'Распределение попыток'
export const NEW_WORD_TEXT = 'Следующее слово через'
export const SHARE_TEXT = 'Поделиться'
export const TOTAL_TRIES_TEXT = 'Всего попыток'
export const SUCCESS_RATE_TEXT = 'Процент успехов'
export const CURRENT_STREAK_TEXT = 'Текущее комбо'
export const BEST_STREAK_TEXT = 'Лучшее комбо'
export const DISCOURAGE_INAPP_BROWSER_TEXT =
  "You are using an embedded browser and may experience problems sharing or saving your results. We encourage you rather to use your device's default browser."
export const CHANGED_MODE_TEXT: Record<GameMode, string> = {
  daily: 'Слово дня',
  practice: 'Бесконечный режим',
}
export const NEW_GAME_TEXT = 'Новая игра'
