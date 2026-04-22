export const normalizeContent = (s?: string): string | undefined =>
  s ? s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n') : undefined
