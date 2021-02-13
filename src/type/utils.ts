import clone from 'clone'

export type All<T> = {
  [P in keyof T]-?: All<NonNullable<T[P]>>
}

type FilteredNull<T> = {
  [P in keyof T]: null extends T[P] ? P : never
}[keyof T]

type FilteredNonNull<T> = {
  [P in keyof T]: null extends T[P] ? never : P
}[keyof T]

export function nullToUndefined<T extends { [key: string]: any }>(
  _obj: T
): {
  [K in FilteredNull<T>]?: NonNullable<T[K]>
} &
  {
    [K in FilteredNonNull<T>]: T[K]
  } {
  const obj = clone(_obj)
  if (typeof obj === 'function' || typeof obj === 'undefined') return obj
  // @ts-ignore
  else if (obj === null) return undefined
  // @ts-ignore
  else if (Array.isArray(obj)) return obj.map((n) => nullToUndefined(n))
  else if (typeof obj === 'object') {
    const tmp = { ...obj }
    Object.keys(tmp).forEach((k) => {
      // @ts-ignore
      tmp[k] = nullToUndefined(tmp[k])
    })
    return tmp
    // @ts-ignore
  } else return obj
}
