export const getStatusOk = (data?: any) => {
    return {
        status: 'ok',
        ...data
    }
}