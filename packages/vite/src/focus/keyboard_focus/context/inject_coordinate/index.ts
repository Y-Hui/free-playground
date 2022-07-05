import { createContext, useContext } from 'react'

/**
 * string 为 json: [x: number, y: number]
 */
const InjectCoordinate = createContext<string>('[]')

InjectCoordinate.displayName = 'InjectCoordinate'

function useInjectCoordinate(x?: number, y?: number) {
  const [injectX, injextY] = JSON.parse(useContext(InjectCoordinate)) as [
    x?: number | null,
    y?: number | null,
  ]

  return [x ?? injectX, y ?? injextY]
}

export { InjectCoordinate, useInjectCoordinate }
