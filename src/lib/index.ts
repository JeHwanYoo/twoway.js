/**
 *
 * @param { Object | undefined | null } object
 * @returns { boolean } if Object is ( {} | undefined | null ) then return true
 */
export function isObjectEmpty(object: Object | undefined | null) {
  return (
    object === undefined ||
    object === null ||
    (Object.keys(object).length === 0 && object.constructor === Object)
  )
}

/**
 *
 * @param { Array<any> | undefined | null } object
 * @returns { boolean } if Object is ( [] | undefined | null ) then return true
 */
export function isArrayEmpty(array: Array<any> | undefined | null) {
  return array === undefined || array === null || array.length === 0
}
