import { useState, useEffect, useCallback, useRef } from 'react'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  CHANGED_MODE_TEXT,
} from './constants/strings'
import {
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
  DISCOURAGE_INAPP_BROWSERS,
  CHAR_COUNT,
} from './constants/settings'
import {
  getPracticeWords,
  getWordsOfDay,
  isWordInWordList,
  unicodeLength,
} from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
  loadShowHelpFromLocalStorage,
  saveShowHelpToLocalStorage,
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import { isInAppBrowser } from './lib/browser'
import { GameMode } from './lib/modes'
import { SolutionContext } from './context/SolutionsContext'

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
  const hash = Number(window.location.hash.substring(1))
  const { solutions: defaultSolutions, solutionIndex: defaultSolutionIndex } =
    hash ? getPracticeWords({ count: 4, seed: hash }) : getWordsOfDay(4)
  const firstRender = useRef(true)
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [solutions, setSolutions] = useState(defaultSolutions)
  const [solutionIndex, setSolutionIndex] = useState(defaultSolutionIndex)
  const [dailySolutionsData] = useState(() => getWordsOfDay(4))
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [mode, setMode] = useState<GameMode>(hash ? 'practice' : 'daily')
  const [isRevealing, setIsRevealing] = useState(false)

  const processSavedGuesses = useCallback(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (!loaded) {
      return []
    }
    const dailySolutions = getWordsOfDay(4).solutions
    if (loaded?.solutions.some((val, i) => dailySolutions[i] !== val)) {
      return []
    }
    const gameWasWon = dailySolutions.every((solution) =>
      loaded.guesses.includes(solution)
    )
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      showErrorAlert(CORRECT_WORD_MESSAGE(dailySolutions), {
        persist: true,
      })
    }
    return loaded.guesses
  }, [showErrorAlert])

  const [guesses, setGuesses] = useState<string[]>(() =>
    hash ? [] : processSavedGuesses()
  )

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (loadShowHelpFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  const resetPracticeGame = () => {
    const { solutions, solutionIndex } = getPracticeWords({ count: 4 })
    setSolutions(solutions)
    setSolutionIndex(solutionIndex)
    setGuesses([])
    setCurrentGuess('')
    setIsGameWon(false)
    setIsGameLost(false)
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    showSuccessAlert(CHANGED_MODE_TEXT[mode])
    if (mode === 'practice') {
      resetPracticeGame()
    } else {
      const { solutions, solutionIndex } = getWordsOfDay(4)
      setSolutions(solutions)
      setSolutionIndex(solutionIndex)
      setGuesses(processSavedGuesses())
      setCurrentGuess('')
    }
  }, [mode, showSuccessAlert, processSavedGuesses])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    if (mode === 'daily') {
      saveGameStateToLocalStorage({ guesses, solutions })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * CHAR_COUNT

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (CHAR_COUNT + 1) * REVEAL_TIME_MS)
    }
  }, [isGameWon, isGameLost, showSuccessAlert])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= CHAR_COUNT &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === CHAR_COUNT)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * CHAR_COUNT)

    if (guesses.length < MAX_CHALLENGES && !isGameWon) {
      const newGuesses = [...guesses, currentGuess]
      //update guesses after animation
      setTimeout(() => {
        setGuesses(newGuesses)
        setCurrentGuess('')
      }, REVEAL_TIME_MS * CHAR_COUNT)

      if (solutions.every((solution) => newGuesses.includes(solution))) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solutions), {
          persist: true,
          delayMs: REVEAL_TIME_MS * CHAR_COUNT + 1,
        })
      }
    }
  }

  return (
    <SolutionContext.Provider
      value={{ ...dailySolutionsData, solutions, solutionIndex }}
    >
      <div className="h-screen flex flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          gameMode={mode}
          onModeChange={(mode) => setMode(mode)}
        />
        <div className="pt-1 px-1 pb-1 w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow max-w-[550px] h-screen">
          <div className="columns-2 h-full">
            {solutions.map((solution, i) => (
              <Grid
                solution={solution}
                key={i}
                guesses={guesses}
                currentGuess={currentGuess}
                isRevealing={isRevealing}
                currentRowClassName={currentRowClass}
              />
            ))}
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            guesses={guesses}
            isRevealing={isRevealing}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => {
              setIsInfoModalOpen(false)
              saveShowHelpToLocalStorage()
            }}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            guesses={guesses}
            gameStats={stats}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            mode={mode}
            onNewGameClick={() => {
              resetPracticeGame()
              setIsStatsModalOpen(false)
            }}
            numberOfGuessesMade={guesses.length}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <AlertContainer />
        </div>
      </div>
    </SolutionContext.Provider>
  )
}

export default App
