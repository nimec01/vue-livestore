import { inject, type InjectionKey } from 'vue'
import { type Store, type LiveQueryDef } from '@livestore/livestore'
import { useQuery } from '.'

export type VueApi = {
  useQuery: typeof useQuery
}

export type LiveStoreInstance = Store & VueApi

export const LiveStoreKey: InjectionKey<LiveStoreInstance> = Symbol('LiveStore')

export const withVueApi = <TQuery extends LiveQueryDef.Any>(store: Store): LiveStoreInstance => {
  // @ts-expect-error TODO figure out best way to resolve
  store.useQuery = (queryDef: TQuery) => useQuery(queryDef, { store })
  return store as LiveStoreInstance
}

export const useStore = (options?: { store: Store }) => {
  if (options?.store) {
    return { store: withVueApi(options.store) }
  }
  const injected = inject(LiveStoreKey)
  if (!injected) {
    throw new Error('LiveStore instance not provided. Make sure to install the provider and pass a store.')
  }
  return { store: injected }
}
