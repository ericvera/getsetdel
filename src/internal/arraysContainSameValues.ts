export const arraysContainSameValues = (
  a: string[] | undefined,
  b: string[] | undefined,
) => {
  if (a === undefined || b === undefined) {
    return a === b
  }

  if (a.length !== b.length) {
    return false
  }

  return a.every((value) => b.includes(value))
}
