/**
 *
 * @param { Object | undefined | null } object
 * @returns { boolean } if Object is ( {} | undefined | null ) then return true
 */
export function isObjectEmpty(object: Object | undefined | null) {
  return (
    isUndefindOrNull(object) ||
    (Object.keys(object).length === 0 && object.constructor === Object)
  )
}

/**
 *
 * @param { Array<any> | undefined | null } object
 * @returns { boolean } if Object is ( [] | undefined | null ) then return true
 */
export function isArrayEmpty(array: Array<any> | undefined | null) {
  return isUndefindOrNull(array) || array.length === 0
}

export function isUndefindOrNull(some: any) {
  return some === undefined || some === null
}
