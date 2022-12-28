/**
 * Returns the error message if the given parameter type is `Error`. 
 * If not, returns `'Unknown Error'`. 
 */
const getErrorMessage = (error: any) => {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    return message;
}

export { getErrorMessage };