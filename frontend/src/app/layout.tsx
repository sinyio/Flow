import type { Metadata } from 'next'
import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'
import './globals.css'

import { ApiProvider } from '@contexts/api-context'
import { AppShell } from '@components/app-shell'
import { BusinessLayout } from '@utils/business-layout'
import { Metrika } from '@utils/yandex-metrika'
import { GlassEffect } from '@utils/glass-effect'

export const metadata: Metadata = {
  title: 'Флоу',
  description: 'Флоу',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <html lang="ru">
    <body>
      <Metrika />
      <GlassEffect />

      <ApiProvider apiHost={process.env.NEXT_PUBLIC_API_HOST ?? ''}>
        <BusinessLayout>
          <AppShell>{children}</AppShell>
        </BusinessLayout>
      </ApiProvider>
    </body>
  </html>
)

export default RootLayout
