export const noCallNextFn = (res: any) => {
    throw new Error('997: No call error.');
}

export const noCallErrorFn = (error: Error) => {
    throw error;
}
