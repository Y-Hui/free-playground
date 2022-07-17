import _ from 'lodash'

import { VECTOR_ERROR, VectorError } from './constant/error'
import type { Coordinates, Vector } from './types'

export function isNumber(value?: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

interface InvalidVal {
  err: VectorError
  value?: Vector
  x: number
  y: number
}
interface ValidVal {
  err?: VectorError
  value: Vector
  x: number
  y: number
}

export type UnionVal = InvalidVal | ValidVal

export function getVector(
  coordinates: Coordinates,
  x: number,
  y: number,
): UnionVal {
  const errVal: InvalidVal = { x, y, err: VECTOR_ERROR.NOT_X_AXIS }
  const yAxis = coordinates[y]
  if (!yAxis) {
    errVal.err = VECTOR_ERROR.NOT_Y_AXIS
    return errVal
  }
  const vector = yAxis[x]
  if (!vector) {
    errVal.err = VECTOR_ERROR.NOT_X_AXIS
    return errVal
  }
  if (vector.disabled) {
    errVal.err = VECTOR_ERROR.DISABLED
    return errVal
  }
  return { value: vector, x, y }
}

/**
 * 根据 x,y 坐标获取右侧的坐标
 */
export function getRightVector(
  coordinates: Coordinates,
  x: number,
  y: number,
): UnionVal {
  const errVal: InvalidVal = { x, y, err: VECTOR_ERROR.NOT_X_AXIS }
  const yAxis = coordinates[y]
  if (!yAxis) {
    errVal.err = VECTOR_ERROR.NOT_Y_AXIS
    return errVal
  }
  if (x >= _.size(yAxis) - 1) {
    errVal.err = VECTOR_ERROR.X_MAXIMUM
    return errVal
  }
  const xIndex = x + 1
  const vector = yAxis[xIndex]
  if (!vector || vector.disabled) {
    return getRightVector(coordinates, xIndex, y)
  }
  return {
    value: vector,
    x: xIndex,
    y,
  }
}

/**
 * 根据 x,y 坐标获取左侧的坐标
 */
export function getLeftVector(
  coordinates: Coordinates,
  x: number,
  y: number,
): UnionVal {
  const errVal: InvalidVal = { x, y, err: VECTOR_ERROR.NOT_X_AXIS }
  if (x <= 0) {
    errVal.err = VECTOR_ERROR.X_MINIMUM
    return errVal
  }
  const yAxis = coordinates[y]
  if (!yAxis) {
    errVal.err = VECTOR_ERROR.NOT_Y_AXIS
    return errVal
  }
  const xIndex = x - 1
  const vector = yAxis[xIndex]
  if (!vector || vector.disabled) {
    return getLeftVector(coordinates, xIndex, y)
  }
  return { value: vector, x: xIndex, y }
}

/**
 * 根据 x,y 坐标获取上方的坐标
 */
export function getTopVector(
  coordinates: Coordinates,
  x: number,
  y: number,
): UnionVal {
  const errVal: InvalidVal = { x, y, err: VECTOR_ERROR.NOT_X_AXIS }
  if (y <= 0) {
    errVal.err = VECTOR_ERROR.Y_MINIMUM
    return errVal
  }
  const yAxis = coordinates[y - 1]
  const vector = yAxis[x]
  if (!vector || vector.disabled) {
    return getTopVector(coordinates, x, y - 1)
  }
  return { value: vector, x, y: y - 1 }
}

/**
 * 根据 x,y 坐标获取下方的坐标
 */
export function getBottomVector(
  coordinates: Coordinates,
  x: number,
  y: number,
): UnionVal {
  const errVal: InvalidVal = { x, y, err: VECTOR_ERROR.NOT_X_AXIS }
  if (y >= _.size(coordinates) - 1) {
    errVal.err = VECTOR_ERROR.Y_MAXIMUM
    return errVal
  }
  const yIndex = y + 1
  const yAxis = coordinates[yIndex]
  // 目标坐标点
  const vector = yAxis[x]
  if (!vector || vector?.disabled) {
    return getBottomVector(coordinates, x, yIndex)
  }
  return { value: vector, x, y: yIndex }
}

/**
 * 获取第一个坐标
 */
export function getFirstVector(coordinates: Coordinates, y: number): UnionVal {
  const vector = coordinates[y][0]
  if (!vector || vector?.disabled) {
    return getRightVector(coordinates, 0, y)
  }
  return { value: vector, x: 0, y }
}

/**
 * 获取最后一个坐标
 */
export function getLastVector(coordinates: Coordinates, y: number) {
  const errVal: InvalidVal = { x: -1, y, err: VECTOR_ERROR.NOT_X_AXIS }
  const yAxis = coordinates[y]
  if (!yAxis) {
    errVal.err = VECTOR_ERROR.NOT_Y_AXIS
    return errVal
  }
  const xIndex = _.size(yAxis) - 1
  const vector = yAxis[xIndex]
  if (!vector || vector.disabled) {
    return getLeftVector(coordinates, xIndex, y)
  }
  return { value: vector, x: xIndex, y }
}

/**
 * 获取 x 坐标上 y 轴第一个可用坐标
 */
export function getYFirstVector(coordinates: Coordinates, x: number) {
  const vector = coordinates[0][x]
  if (!vector || vector?.disabled) {
    return getBottomVector(coordinates, x, 0)
  }
  return { value: vector, x, y: 0 }
}

/**
 * 获取 x 坐标上 y 轴最后一个可用坐标
 */
export function getYLastVector(coordinates: Coordinates, x: number) {
  const errVal: InvalidVal = { x, y: -1, err: VECTOR_ERROR.NOT_X_AXIS }
  const maxYIndex = _.size(coordinates) - 1
  if (maxYIndex < 0) {
    errVal.err = VECTOR_ERROR.NOT_Y_AXIS
    return errVal
  }
  const yAxis = coordinates[maxYIndex]
  const vector = yAxis[x]
  if (!vector || vector.disabled) {
    return getTopVector(coordinates, x, maxYIndex)
  }
  return { value: vector, x, y: maxYIndex }
}
