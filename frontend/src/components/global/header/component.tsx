import Image from 'next/image'
import { Button, Link, Text } from '@gravity-ui/uikit'
import { redirect } from 'next/navigation'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'
import styles from './component.module.css'

export const Header = () => (
  <div className={styles.outer}>
    <LiquidGlassBlock className={styles.container}>
      <Image priority alt="" src="/logo.png" width={96} height={48} className={styles.logo} />

      <nav aria-label="Навигация">
        <ul className={styles.nav}>
          <li>
            <Link view="primary" className={styles.navLink} href="/">
              <Text variant="subheader-2">Лента объявлений</Text>
            </Link>
          </li>
          <li>
            <Link view="primary" className={styles.navLink} href="/">
              <Text variant="subheader-2">Наше медиа</Text>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.actions}>
        <Button view="normal" size="xl" onClick={() => redirect('/ads')}>
          Создать объявление
        </Button>
        <Button view="outlined" size="xl" onClick={() => redirect('/auth?action=login')}>
          Войти
        </Button>
      </div>
    </LiquidGlassBlock>
  </div>
)
