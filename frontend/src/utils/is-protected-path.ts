const protectedPaths = ['profile', 'ads']

export const isProtectedPath = (url: string) => protectedPaths.some(path => url.includes(path))
