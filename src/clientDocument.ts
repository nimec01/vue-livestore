/* eslint-disable @typescript-eslint/no-explicit-any */
import { onUnmounted, shallowRef, type Ref } from 'vue'

import { queryDb, type SessionIdSymbol, type State, type RowQuery, type LiveQueryDef } from '@livestore/livestore'

import { useStore } from './store'

type TTableDef = State.SQLite.ClientDocumentTableDef.Trait<
  any,
  any,
  any,
  { partialSet: boolean; default: { id: string | SessionIdSymbol; value: any } }
>

interface UseClientDocumentResult<T> {
  state: Readonly<Ref<TTableDef['Value']>>
  setState: (value: TTableDef['Value']) => void
  id: string | typeof SessionIdSymbol,
  query$: LiveQueryDef<T>
}

export function useClientDocument<T = any>(
  table: TTableDef,
  id?: string | typeof SessionIdSymbol,
  options?: RowQuery.GetOrCreateOptions<TTableDef>,
): UseClientDocumentResult<T> {

  const { store } = useStore()

  if (!store) {
    throw new Error('Store not found. Make sure you are using LiveStoreProvider.')
  }

  const documentId = id ?? table.default?.id
  if (!documentId) {
    throw new Error('Client document requires an ID')
  }

  const query$ = queryDb(table.get(documentId, options))
  const state = shallowRef(store.query(query$))

  const unsubscribe = store.subscribe(query$, {
    onUpdate: (result: T) => {
      state.value = result
    }
  })

  const setState = (value: TTableDef['Value']) => {
    store.commit(table.set(value, documentId))
  }

  onUnmounted(() => unsubscribe())

  return {
    state,
    setState,
    id: documentId,
    query$
  }
}
