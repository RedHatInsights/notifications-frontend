/**
 * Ultra-condensed error message extraction utility
 */
export const extractErrorMessage = (error): string =>
  [
    'message',
    'error',
    'errorObject.message',
    'response.data.message',
    'response.data.error',
    'response.data.title',
    'response.data',
  ]
    .map((path) => path.split('.').reduce((obj, key) => obj?.[key], error))
    .find((value) => typeof value === 'string' && value.trim()) ||
  (error && typeof error === 'object'
    ? JSON.stringify(error, null, 2)
    : String(error));
