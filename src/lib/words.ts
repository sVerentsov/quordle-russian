import { WORDS } from '../constants/wordlist'
import { VALID_GUESSES } from '../constants/validGuesses'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { default as seedrandom } from 'seedrandom'

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  )
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getWordsOfDay = (count: number) => {
  // January 1, 2022 Game Epoch
  const epoch = new Date(2022, 0)
  const start = new Date(epoch)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let index = 0
  while (start < today) {
    index++
    start.setDate(start.getDate() + 1)
  }

  const nextDay = new Date(today)
  nextDay.setDate(today.getDate() + 1)

  const rand = seedrandom(index.toString())
  const results: Array<number> = []

  while (results.length < count) {
    while (true) {
      const ind = Math.floor(rand() * (WORDS.length + 1))
      if (!results.includes(ind)) {
        results.push(ind)
        break
      }
    }
  }

  return {
    solutions: results.map((ind) =>
      localeAwareUpperCase(WORDS[ind % WORDS.length])
    ),
    solutionIndex: index,
    tomorrow: nextDay.valueOf(),
  }
}

export const { solutions, solutionIndex, tomorrow } = getWordsOfDay(4)
