import { createContext, useContext } from 'react'

/**
 * string 为 json: [x: number, y: number]
 */
const InjectCoordinate = createContext<string>('[]')

function useInjectCoordinate(x?: number, y?: number) {
  const [injectX, injextY] = JSON.parse(useContext(InjectCoordinate)) as [
    x?: number,
    y?: number,
  ]

  return [x ?? injectX, y ?? injextY]
}

export { InjectCoordinate, useInjectCoordinate }
