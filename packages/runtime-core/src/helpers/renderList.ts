import { VNodeChild } from '../vnode'
import { isArray, isString, isObject } from '@vue/shared'
import { warn } from '../warning'

/**
 * v-for string
 * @private
 */
export function renderList(
  source: string,
  renderItem: (value: string, index: number) => VNodeChild
): VNodeChild[]

/**
 * v-for number
 */
export function renderList(
  source: number,
  renderItem: (value: number, index: number) => VNodeChild
): VNodeChild[]

/**
 * v-for array
 */
export function renderList<T>(
  source: T[],
  renderItem: (value: T, index: number) => VNodeChild
): VNodeChild[]

/**
 * v-for iterable
 */
export function renderList<T>(
  source: Iterable<T>,
  renderItem: (value: T, index: number) => VNodeChild
): VNodeChild[]

/**
 * v-for object
 */
export function renderList<T>(
  source: T,
  renderItem: <K extends keyof T>(
    value: T[K],
    key: K,
    index: number
  ) => VNodeChild
): VNodeChild[]

/**
 * Actual implementation
 */
export function renderList(
  source: any,
  renderItem: (...args: any[]) => VNodeChild
): VNodeChild[] {
  // debugger
  let ret: VNodeChild[]
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length)
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i)
    }
  } else if (typeof source === 'number') {
    if (__DEV__ && !Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`)
      return []
    }
    ret = new Array(source)
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i)
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator as any]) {
      ret = Array.from(source as Iterable<any>, renderItem)
    } else {
      const keys = Object.keys(source)
      ret = new Array(keys.length)
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        ret[i] = renderItem(source[key], key, i)
      }
    }
  } else {
    ret = []
  }
  return ret
}
