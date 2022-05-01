import { unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct'

export const getStatuses = (
  solutions: string[],
  guesses: string[]
): { [key: string]: CharStatus[] } => {
  const charObj: { [key: string]: CharStatus[] } = {}
  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, pos) => {
      solutions.forEach((sol, i) => {
        const splitSolution = unicodeSplit(sol)
        if (charObj[letter] === undefined) {
          charObj[letter] = [];
        }
        if (!splitSolution.includes(letter)) {
          // make status absent
          return (charObj[letter][i] = 'absent')
        }

        if (letter === splitSolution[pos]) {
          //make status correct
          return (charObj[letter][i] = 'correct')
        }

        if (charObj[letter][i] !== 'correct') {
          //make status present
          return (charObj[letter][i] = 'present')
        }
      })
    })
  })

  return charObj
}

export const getGuessStatuses = (
  solution: string,
  guess: string
): CharStatus[] => {
  const splitSolution = unicodeSplit(solution)
  const splitGuess = unicodeSplit(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent'
      return
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = 'absent'
      return
    }
  })

  return statuses
}
