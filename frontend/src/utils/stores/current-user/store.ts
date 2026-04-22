import type { AxiosInstance } from 'axios'
import { create } from 'zustand'

import { me } from '@api/auth'

type TStatus = 'idle' | 'loading' | 'loaded'

interface ICurrentUserState {
  userId: string | null
  status: TStatus
}

interface ICurrentUserActions {
  fetch: (axiosInstance: AxiosInstance) => Promise<string | null>
  invalidate: () => void
  clear: () => void
}

type TCurrentUserStore = ICurrentUserState & ICurrentUserActions

let _pending: Promise<string | null> | null = null

export const useCurrentUserStore = create<TCurrentUserStore>()((set, get) => ({
  userId: null,
  status: 'idle',

  fetch: (axiosInstance) => {
    const { status, userId } = get()

    if (status === 'loaded') return Promise.resolve(userId)
    if (_pending) return _pending

    set({ status: 'loading' })

    _pending = me(axiosInstance)
      .then(res => {
        const id = 'userId' in res.data ? res.data.userId : null
        set({ userId: id, status: 'loaded' })
        return id
      })
      .catch(() => {
        set({ userId: null, status: 'loaded' })
        return null
      })
      .finally(() => { _pending = null })

    return _pending
  },

  invalidate: () => {
    _pending = null
    set({ userId: null, status: 'idle' })
  },

  clear: () => {
    _pending = null
    set({ userId: null, status: 'loaded' })
  },
}))
