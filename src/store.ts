import { inject, type InjectionKey } from 'vue'
import { type Store } from '@livestore/livestore'
import { useQuery } from '.'
import { useClientDocument } from '.'

export type VueApi = {
  useQuery: typeof useQuery,
  useClientDocument: typeof useClientDocument
}

export type LiveStoreInstance = Store & VueApi

export const LiveStoreKey: InjectionKey<LiveStoreInstance> = Symbol('LiveStore')

export const withVueApi = (store: Store): LiveStoreInstance => {
  const _store = store as LiveStoreInstance
  _store.useQuery = (queryDef) => useQuery(queryDef, { store })
  _store.useClientDocument = (table, id, options) => useClientDocument(table, id, options, { store })
  return _store
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
