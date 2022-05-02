import React from 'react'
import { getWordsOfDay } from '../lib/words'

type SolutionContextType = {
  solutions: string[]
  solutionIndex: number
  tomorrow: number
}

export const SolutionContext = React.createContext<SolutionContextType>(
  getWordsOfDay(4)
)
