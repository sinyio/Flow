export const toIso = (d: string | Date) => (typeof d === 'string' ? new Date(d).toISOString() : d.toISOString())
