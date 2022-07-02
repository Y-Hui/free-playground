import _ from 'lodash'

import type { Vector } from '../context/focus'

const ZOMBIE_MARK = Symbol('IS_ZOMBIE_POINT')

export function createZombiePoint(value: Vector) {
  return Object.defineProperty({ ...value }, ZOMBIE_MARK, {
    value: true,
    writable: false,
  })
}

export function isZombiePoint(value: unknown) {
  if (_.isPlainObject(value)) {
    return (value as Record<PropertyKey, unknown>)[ZOMBIE_MARK] === true
  }
  return false
}
