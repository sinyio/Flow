const protectedPaths = ['profile', 'ads']

export const isProtectedPath = (url: string) => protectedPaths.find(path => url.includes(path))
