'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ReactNode } from 'react'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'
import { Typography } from '@components/typography/component'
import { TAuthorizationStep, useAuthorizationStore } from '@utils/stores/authorization'
import { useResponsive } from '@utils/hooks/use-responsive'
import { ForgotPasswordStep } from './steps/forgot-password-step/step'
import { SignInStep } from './steps/sign-in-step/step'
import { SignUpStep } from './steps/sign-up-step/step'
import styles from './view.module.scss'

const headerMap: Record<TAuthorizationStep, string> = {
  'sign-up': 'Регистрация',
  'sign-in': 'Вход',
  'forgot-password': 'Восстановление пароля',
  'check-email': 'Проверьте почту',
}

const stepsMap: Record<TAuthorizationStep, ReactNode> = {
  'sign-up': <SignUpStep />,
  'sign-in': <SignInStep />,
  'forgot-password': <ForgotPasswordStep />,
  'check-email': <div>Проверьте почту</div>,
}

const AuthorizationView = () => {
  const device = useResponsive()

  const { authorizationStep } = useAuthorizationStore(store => store)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Until hydration is complete, avoid DOM branch switching driven by media queries.
  const isMobile = mounted && device === 'mobile'

  return (
    <>
      <div aria-hidden="true" className={styles.background}>
        <Image
          priority
          fill
          className={styles.backgroundImage}
          alt=""
          sizes="120vw"
          src="/authorization/authorization-background.webp"
        />
      </div>
      <div className={styles.content}>
        <LiquidGlassBlock className={styles.glassBlock}>
          {isMobile ? (
            <Image src="/logo.png" alt="" width={200} height={100} className={styles.flowImage} />
          ) : (
            <>
              <Typography variant="display3" className={styles.title}>
                {headerMap[authorizationStep]}
              </Typography>

              <div className={styles.divider} />
            </>
          )}
          {stepsMap[authorizationStep]}
        </LiquidGlassBlock>
      </div>
    </>
  )
}

export default AuthorizationView
