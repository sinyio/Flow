export const filterEmptyValues = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== '')
    )
}