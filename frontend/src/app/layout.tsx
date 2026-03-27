import type { Metadata } from 'next'
import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'
import './globals.css'

import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

import { AppShell } from '@components/global/app-shell'
import { ApiProvider } from '@contexts/api-context'
import { BusinessLayout } from '@utils/business-layout'
import { Metrika } from '@utils/yandex-metrika'
import { GlassEffect } from '@utils/glass-effect'
import Error from './error'
import { TServerData } from '@utils/server-data-provider'

export const metadata: Metadata = {
  title: 'Флоу',
  description: 'Флоу',
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const h = await headers()

  const deviceType = userAgent({ headers: h }).device.type || 'desktop'

  const serverData: TServerData = {
    deviceType,
  }

  return (
    <html lang="ru">
      <body>
        <Metrika />
        <GlassEffect />

        <ApiProvider apiHost={process.env.NEXT_PUBLIC_API_HOST ?? ''}>
          <BusinessLayout serverData={serverData}>
            <AppShell>
              <ErrorBoundary errorComponent={Error}>{children}</ErrorBoundary>
            </AppShell>
          </BusinessLayout>
        </ApiProvider>
      </body>
    </html>
  )
}

export default RootLayout
