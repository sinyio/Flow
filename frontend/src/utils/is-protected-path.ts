const protectedPaths = [
  // 'profile'
]

export const isProtectedPath = (url: string) => protectedPaths.find(path => url.includes(path))
