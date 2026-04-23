export const buildSearchUrl = (params: Record<string, string | number | boolean | undefined>) => {
  const sp = new URLSearchParams()

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === '' || v === false) return
    sp.set(k, String(v))
  })
  const q = sp.toString()

  return q ? `/feed?${q}` : '/feed'
}
