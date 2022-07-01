interface UnknownConstructor<T> {
  new (...args: unknown[]): T
}

function hasConstructor(val: unknown): val is UnknownConstructor<unknown> {
  return true
}
function isDate(val: unknown): val is Date {
  return true
}
type v = Extract<string, { a: string }>

console.log(new Date().constructor)
console.log(new Date().constructor)

function deep<T>(target: T): T {
  if (isDate(target)) {
    console.log(target)
  }
  return target
}

export {}
