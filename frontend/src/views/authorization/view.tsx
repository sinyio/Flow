'use client'

import Image from 'next/image'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'
import { PageContainer } from '@components/page-container/component'
import { Typography } from '@components/typography/component'
import { useAuthorizationStore } from '@utils/stores/authorization'
import { useResponsive } from '@utils/hooks/use-responsive'
import { ForgotPasswordStep } from './steps/forgot-password-step/step'
import { SignInStep } from './steps/sign-in-step/step'
import { SignUpStep } from './steps/sign-up-step/step'
import styles from './view.module.css'

const AuthorizationView = () => {
  const step = useAuthorizationStore(state => state.step)
  const device = useResponsive()

  return (
    <PageContainer>
      <Image
        aria-hidden
        width={3076}
        height={4096}
        className={styles.backgroundImage}
        alt=""
        src="/authorization/authorization-background.webp"
      />
      <LiquidGlassBlock className={styles.glassBlock}>
        {device === 'mobile' ? (
          <Image src="/logo.png" alt="" width={200} height={100} className={styles.flowImage} />
        ) : step === 'forgot-password' ? (
          <Typography variant="display3" className={styles.title}>
            Восстановление пароля
          </Typography>
        ) : step === 'sign-in' ? (
          <Typography variant="display3" className={styles.title}>
            Вход
          </Typography>
        ) : (
          <Typography variant="display3" className={styles.title}>
            Регистрация
          </Typography>
        )}
        <div className={styles.divider} />
        {step === 'sign-up' && <SignUpStep />}
        {step === 'sign-in' && <SignInStep />}
        {step === 'forgot-password' && <ForgotPasswordStep />}
      </LiquidGlassBlock>
    </PageContainer>
  )
}

export default AuthorizationView
