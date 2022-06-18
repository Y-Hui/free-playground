import loadable, { DefaultComponent } from '@loadable/component'

export type LazyLoadFn<Props> = () => Promise<DefaultComponent<Props>>

export default function lazy<Props>(
  load: LazyLoadFn<Props>,
  loading?: JSX.Element,
) {
  return loadable(load, { fallback: loading })
}
