export function hasStatusCode(error: unknown, statusCode: number): boolean {
  return typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && error.statusCode === statusCode
}
