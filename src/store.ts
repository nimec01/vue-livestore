import { inject, type InjectionKey } from 'vue'
import { type Store, } from '@livestore/livestore'
import { useQuery } from '.'

export type VueApi = {
  useQuery: typeof useQuery
}

export type LiveStoreInstance = Store & VueApi

export const LiveStoreKey: InjectionKey<LiveStoreInstance> = Symbol('LiveStore')

export const withVueApi = (store: Store): LiveStoreInstance => {
  // @ts-ignore
  store.useQuery = (queryDef: any) => useQuery(queryDef, { store })
  return store as LiveStoreInstance
}

export const useStore = (options?: { store: Store }) => {
  if (options?.store) {
    return { store: withVueApi(options.store) }
  }
  return { store: inject(LiveStoreKey) }
}