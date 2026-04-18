const protectedPaths = ['profile', 'ads', 'chats']

export const isProtectedPath = (url: string) => protectedPaths.some(path => url.includes(path))
