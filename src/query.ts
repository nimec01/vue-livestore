import { shallowRef, onUnmounted, type Ref } from 'vue'

import type { LiveQueryDef, Store } from '@livestore/livestore'
import type { LiveQueries } from '@livestore/livestore/internal'

import { useStore } from './store'

export const useQuery = <TQuery extends LiveQueryDef.Any>(
  queryDef: TQuery,
  options?: { store: Store }
): Readonly<Ref<LiveQueries.GetResult<TQuery>>> => {
  const { store } = useStore(options)

  type Result = LiveQueries.GetResult<TQuery>

  const data = shallowRef(store?.query(queryDef as any) as Result) // eslint-disable-line @typescript-eslint/no-explicit-any

  const unsubscribe = store?.subscribe(queryDef as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
    onUpdate: (result: Result) => {
      data.value = result
    }
  })
  onUnmounted(() => unsubscribe?.())

  return data
}
