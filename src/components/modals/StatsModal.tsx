import Countdown from 'react-countdown'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { GameStats } from '../../lib/localStorage'
import { shareStatus } from '../../lib/share'
import { BaseModal } from './BaseModal'
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  NEW_GAME_TEXT,
  PRACTICE_MODE_TEXT,
} from '../../constants/strings'
import { useContext } from 'react'
import { SolutionContext } from '../../context/SolutionsContext'
import { GameMode } from '../../lib/modes'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  isDarkMode: boolean
  mode: GameMode
  isHighContrastMode: boolean
  numberOfGuessesMade: number
  onNewGameClick: () => void
  onPracticeModeClick: () => void
}

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  mode,
  handleShareToClipboard,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
  onNewGameClick,
  onPracticeModeClick,
}: Props) => {
  const { solutions, solutionIndex, tomorrow } = useContext(SolutionContext)
  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        gameStats={gameStats}
        isGameWon={isGameWon}
        numberOfGuessesMade={numberOfGuessesMade}
      />
      {(isGameLost || isGameWon) &&
        (mode === 'daily' ? (
          <BottomButtonsDaily
            tomorrow={tomorrow}
            onPracticeModeClick={() => onPracticeModeClick()}
            solutions={solutions}
            guesses={guesses}
            isGameLost={isGameLost}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            solutionIndex={solutionIndex}
            handleShareToClipboard={handleShareToClipboard}
            mode={mode}
          />
        ) : (
          <BottomButtonsPractice
            onNewGameClick={() => onNewGameClick()}
            solutions={solutions}
            guesses={guesses}
            isGameLost={isGameLost}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            solutionIndex={solutionIndex}
            handleShareToClipboard={handleShareToClipboard}
            mode={mode}
          />
        ))}
    </BaseModal>
  )
}
type BottomButtonsDailyProps = {
  tomorrow: number
  onPracticeModeClick: () => void
  solutions: string[]
  guesses: string[]
  isGameLost: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  solutionIndex: number
  handleShareToClipboard: () => void
  mode: GameMode
}

const BottomButtonsDaily = ({
  tomorrow,
  onPracticeModeClick,
  solutions,
  guesses,
  isGameLost,
  isDarkMode,
  isHighContrastMode,
  solutionIndex,
  handleShareToClipboard,
  mode,
}: BottomButtonsDailyProps) => {
  return (
    <div className="mt-5 sm:mt-6 dark:text-white flex flex-row items-center">
      <div>
        <h5>{NEW_WORD_TEXT}</h5>
        <Countdown
          className="text-lg font-medium text-gray-900 dark:text-gray-100"
          date={tomorrow}
          daysInHours={true}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <button
          type="button"
          className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={() => {
            shareStatus(
              solutions,
              guesses,
              isGameLost,
              isDarkMode,
              isHighContrastMode,
              solutionIndex,
              handleShareToClipboard,
              mode
            )
          }}
        >
          {SHARE_TEXT}
        </button>
        <button
          type="button"
          className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={() => onPracticeModeClick()}
        >
          {PRACTICE_MODE_TEXT}
        </button>
      </div>
    </div>
  )
}
type BottomButtonPracticeProps = {
  onNewGameClick: () => void
  solutions: string[]
  guesses: string[]
  isGameLost: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  solutionIndex: number
  handleShareToClipboard: () => void
  mode: GameMode
}

function BottomButtonsPractice({
  onNewGameClick,
  solutions,
  guesses,
  isGameLost,
  isDarkMode,
  isHighContrastMode,
  solutionIndex,
  handleShareToClipboard,
  mode,
}: BottomButtonPracticeProps) {
  return (
    <div className="mt-5 sm:mt-6 flex flex-row space-x-4">
      <button
        type="button"
        className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={() => {
          shareStatus(
            solutions,
            guesses,
            isGameLost,
            isDarkMode,
            isHighContrastMode,
            solutionIndex,
            handleShareToClipboard,
            mode
          )
        }}
      >
        {SHARE_TEXT}
      </button>
      <button
        type="button"
        className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={() => onNewGameClick()}
      >
        {NEW_GAME_TEXT}
      </button>
    </div>
  )
}
