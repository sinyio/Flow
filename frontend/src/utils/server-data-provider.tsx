import { createContext, useContext } from 'react'

export type TServerData = {
  deviceType: 'mobile' | 'tablet' | 'desktop' | string
}

export const ServerData = createContext<TServerData | null>(null)

export const useServerData = () => useContext(ServerData)
