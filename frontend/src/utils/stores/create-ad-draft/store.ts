import { create } from 'zustand'

import type { TCreateAdFormValues } from '@views/ad/create/form/types'

interface ICreateAdDraftState {
  values: TCreateAdFormValues | null
  previewUrl: string | null
}

interface ICreateAdDraftActions {
  save: (values: TCreateAdFormValues, previewUrl: string | null) => void
  clear: () => void
}

export const useCreateAdDraftStore = create<ICreateAdDraftState & ICreateAdDraftActions>()((set) => ({
  values: null,
  previewUrl: null,
  save: (values, previewUrl) => set({ values, previewUrl }),
  clear: () => set({ values: null, previewUrl: null }),
}))
