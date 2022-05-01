import { BaseModal } from './BaseModal'
import { SettingsToggle } from './SettingsToggle'
import { HIGH_CONTRAST_MODE_DESCRIPTION } from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isDarkMode: boolean
  handleDarkMode: Function
  isHighContrastMode: boolean
  handleHighContrastMode: Function
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  isDarkMode,
  handleDarkMode,
  isHighContrastMode,
  handleHighContrastMode,
}: Props) => {
  return (
    <BaseModal title="Настройки" isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col mt-2 divide-y">
        <SettingsToggle
          settingName="Темная тема"
          flag={isDarkMode}
          handleFlag={handleDarkMode}
        />
        <SettingsToggle
          settingName="Яркие цвета"
          flag={isHighContrastMode}
          handleFlag={handleHighContrastMode}
          description={HIGH_CONTRAST_MODE_DESCRIPTION}
        />
      </div>
    </BaseModal>
  )
}
