import { GetSetValResetError } from './GetSetValResetError.js'

/**
 * Handles errors thrown by GetSetVal functions. If the error is a
 * GetSetValResetError, the function calls onResetError. If the error is not a
 * GetSetValResetError, the function rethrows the error.
 */
export const handleResetError =
  (onResetError: () => Promise<void>) => async (error: unknown) => {
    if (error instanceof GetSetValResetError) {
      await onResetError()
    } else {
      throw error
    }
  }
