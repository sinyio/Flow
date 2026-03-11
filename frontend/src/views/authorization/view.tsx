import Image from 'next/image'
import { TextInput } from '@gravity-ui/uikit'

import { LiquidGlassBlock } from '@components/liquid-glass-block/component'

const AuthorizationView = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    }}
  >
    <Image
      aria-hidden
      width={3076}
      height={4096}
      style={{ height: 'auto', width: '100%', position: 'absolute', top: 0, left: 0 }}
      alt=""
      src="/authorization/authorization-background.webp"
    />
    <LiquidGlassBlock style={{ borderRadius: '20px', padding: '20px' }}>
      <TextInput type="email" size="xl" />
    </LiquidGlassBlock>
  </div>
)

export default AuthorizationView
