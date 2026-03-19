'use client'

import Image from 'next/image'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Button } from '@gravity-ui/uikit'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'
import styles from './component.module.css'
import { Typography } from '@components/typography/component'

export interface HeaderNavLink extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> {
  label: string
  href: string
}

export interface HeaderProps {
  className?: string
  links?: HeaderNavLink[]
  createAdLabel?: string
  loginLabel?: string
  onCreateAdClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  onLoginClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

export const Header = ({ className, onCreateAdClick, onLoginClick }: HeaderProps) => (
  <div className={`${styles.outer} ${className ?? ''}`}>
    <LiquidGlassBlock className={styles.container}>
      <Image priority alt="" src="/logo.png" width={96} height={48} className={styles.logo} />

      <nav aria-label="Навигация">
        <ul className={styles.nav}>
          <li>
            <a className={styles.navLink} href="#">
              <Typography variant="subheader2">Лента объявлений</Typography>
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              <Typography variant="subheader2">Наше медиа</Typography>
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.actions}>
        <Button view="normal" size="l" onClick={onCreateAdClick}>
          Создать объявление
        </Button>
        <Button view="outlined" size="l" onClick={onLoginClick}>
          Войти
        </Button>
      </div>
    </LiquidGlassBlock>
  </div>
)
