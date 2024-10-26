import { GetSetValResetError } from './GetSetValResetError.js'

export const handleResetError =
  (onResetError: () => Promise<void>) => async (error: unknown) => {
    if (error instanceof GetSetValResetError) {
      await onResetError()
    } else {
      throw error
    }
  }
