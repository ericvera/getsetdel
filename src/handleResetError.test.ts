import { expect, it, vi } from 'vitest'
import { GetSetDelResetError, handleResetError } from './index.js'

it('calls the handler if the error is a reset error', async () => {
  const f = async () => {
    return Promise.reject(new Error('not reset'))
  }

  const handlerFn = vi.fn()

  await expect(
    f().catch(handleResetError(handlerFn)),
  ).rejects.toMatchInlineSnapshot(`[Error: not reset]`)
})

it('rethrows the error if it is not a reset error', async () => {
  const f = async () => {
    return Promise.reject(
      new GetSetDelResetError('some-db-name', 'some reason'),
    )
  }

  const handlerFn = vi.fn()

  await expect(f().catch(handleResetError(handlerFn))).resolves.toBeUndefined()

  expect(handlerFn).toHaveBeenCalledOnce()
})
