export const getNoun = (number: number, one: string, two: string, many: string): string => {
  let n = Math.abs(number)

  n %= 100
  if (n >= 5 && n <= 20) {
    return `${number} ${many}`
  }
  n %= 10
  if (n === 1) {
    return `${number} ${one}`
  }
  if (n >= 2 && n <= 4) {
    return `${number} ${two}`
  }

  return `${number} ${many}`
}
