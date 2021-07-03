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
