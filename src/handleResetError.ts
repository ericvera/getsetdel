import { GetSetDelResetError } from './GetSetDelResetError.js'

/**
 * Handles errors thrown by GetSetDel functions. If the error is a
 * GetSetDelResetError, the function calls onResetError. If the error is not a
 * GetSetDelResetError, the function rethrows the error.
 */
export const handleResetError =
  (onResetError: () => Promise<void>) => async (error: unknown) => {
    if (error instanceof GetSetDelResetError) {
      await onResetError()
    } else {
      throw error
    }
  }
