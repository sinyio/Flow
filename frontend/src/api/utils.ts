export const toIso = (d: string | Date) => (typeof d === 'string' ? d : d.toISOString())
