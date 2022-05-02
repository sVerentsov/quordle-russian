import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  PuzzleIcon,
  CalendarIcon,
} from '@heroicons/react/outline'
import { GAME_TITLE } from '../../constants/strings'
import { GameMode } from '../../lib/modes'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  gameMode: GameMode
  onModeChange: (newMode: GameMode) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  gameMode,
  onModeChange,
}: Props) => {
  return (
    <div className="navbar">
      <div className="navbar-content px-5">
        <InformationCircleIcon
          className="h-6 w-6 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <p className="text-xl ml-2.5 font-bold dark:text-white">{GAME_TITLE}</p>
        <div className="right-icons">
          {gameMode === 'daily' ? (
            <CalendarIcon
              className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
              onClick={() => onModeChange('practice')}
            />
          ) : (
            <PuzzleIcon
              className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
              onClick={() => onModeChange('daily')}
            />
          )}
          <ChartBarIcon
            className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
