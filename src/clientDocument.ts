/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowRef, onUnmounted, computed, type WritableComputedRef } from 'vue'

import { queryDb, type SessionIdSymbol, type State, type RowQuery, type LiveQueryDef } from '@livestore/livestore'

import { useStore } from './store'
import { useQuery } from './query'

type TTableDef = State.SQLite.ClientDocumentTableDef.Trait<
  any,
  any,
  any,
  { partialSet: boolean; default: { id: string | SessionIdSymbol; value: any } }
>

interface UseClientDocumentResult<T> {
  state: WritableComputedRef<T>
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
  const initialData = useQuery(query$) as T
  const internalState = shallowRef<T>(initialData)

  // Flag to prevent infinite loops.
  let isUpdatingFromStore = false
  const unsubscribe = store.subscribe(query$, {
    onUpdate: (result: T) => {
      isUpdatingFromStore = true
      internalState.value = result
      isUpdatingFromStore = false
    }
  })

  console.log('internalState', internalState.value)
  console.log('initialData', initialData)
  console.log('query$', query$)

  const state = computed<T>({
    get() {
      return internalState.value
    },
    set(value: T) {
      console.log('setting', value)
      if (isUpdatingFromStore) return
      store.commit(table.set({ value }, documentId))
    }
  })

  onUnmounted(() => unsubscribe())

  return {
    state,
    id: documentId,
    query$
  }
}
