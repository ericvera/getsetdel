/**
 * Error thrown when a reset of the store is required. The error message
 * explains why the store needs to be reset.
 */
export class GetSetDelResetError extends Error {
  public constructor(dbName: string, reason: string) {
    // 'Error' breaks prototype chain here
    super(`A reset of the store '${dbName}' is required. (Reason: ${reason})`)

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
