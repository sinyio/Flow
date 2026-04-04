import { Button, DropdownMenu, Icon } from '@gravity-ui/uikit'

import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { DotsIcon } from '@components/svgr/dots-icon/icon'
import { FlagIcon } from '@components/svgr/flag-icon/icon'
import { ShareIcon } from '@components/svgr/share-icon/icon'

import styles from './header.module.css'

export const Header = () => (
  <div className={styles.header}>
    <Button view="normal" size="l">
      <Icon data={ArrowIcon} />
    </Button>
    <DropdownMenu
      size="l"
      popupProps={{ placement: 'bottom-end', offset: 8, style: { width: '200px' } }}
      renderSwitcher={props => (
        <Button {...props} view="normal" size="l">
          <Icon data={DotsIcon} />
        </Button>
      )}
      items={[
        {
          iconStart: <FlagIcon />,
          text: 'Пожаловаться',
          action: () => console.log('123'),
        },
        {
          iconStart: <ShareIcon />,
          text: 'Поделиться',
          action: () => console.log('123'),
        },
      ]}
    />
  </div>
)
