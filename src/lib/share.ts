import { getGuessStatuses } from './statuses'
import { unicodeSplit } from './words'
import { GAME_TITLE, HOME_LINK } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'
import { GameMode } from './modes'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
  solutions: string[],
  guesses: string[],
  lost: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  solutionIndex: number,
  handleShareToClipboard: () => void,
  mode: GameMode
) => {
  const textToShare =
    `${GAME_TITLE} ${solutionIndex} ${
      lost ? 'X' : guesses.length
    }/${MAX_CHALLENGES}\n\n${HOME_LINK}${
      mode === 'practice' ? '#' + solutionIndex : ''
    }\n\n` +
    generateEmojiGrid(
      solutions,
      guesses,
      getEmojiTiles(isDarkMode, isHighContrastMode)
    )

  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare)
    handleShareToClipboard()
  }
}

const generateEmojiLine = (
  solution: string,
  guess: string,
  tiles: string[],
  skip: boolean
): string => {
  if (skip) {
    return unicodeSplit(guess)
      .map((_) => tiles[3])
      .join('')
  }
  const status = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return splitGuess
    .map((_, i) => {
      switch (status[i]) {
        case 'correct':
          return tiles[0]
        case 'present':
          return tiles[1]
        default:
          return tiles[2]
      }
    })
    .join('')
}

export const generateEmojiGrid = (
  solutions: string[],
  guesses: string[],
  tiles: string[]
) => {
  const correctGuessInds = solutions.map((sol) =>
    guesses.findIndex((g) => g === sol)
  )
  const row1 = guesses
    .map(
      (guess, i) =>
        generateEmojiLine(
          solutions[0],
          guess,
          tiles,
          correctGuessInds[0] > -1 && i > correctGuessInds[0]
        ) +
        ' ' +
        generateEmojiLine(
          solutions[2],
          guess,
          tiles,
          correctGuessInds[2] > -1 && i > correctGuessInds[2]
        )
    )
    .join('\n')
  const row2 = guesses
    .map(
      (guess, i) =>
        generateEmojiLine(
          solutions[1],
          guess,
          tiles,
          correctGuessInds[1] > -1 && i > correctGuessInds[1]
        ) +
        ' ' +
        generateEmojiLine(
          solutions[3],
          guess,
          tiles,
          correctGuessInds[3] > -1 && i > correctGuessInds[3]
        )
    )
    .join('\n')
  return [row1, row2].join('\n\n')
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟧' : '🟩')
  tiles.push(isHighContrastMode ? '🟦' : '🟨')
  tiles.push(isDarkMode ? '⬛' : '⬜')
  tiles.push(isDarkMode ? '▪️' : '▫️')
  return tiles
}
