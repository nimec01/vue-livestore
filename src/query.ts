import { ref, onUnmounted, type Ref } from 'vue'

import type { LiveQueryDef, Store } from '@livestore/livestore'
import type { LiveQueries } from '@livestore/livestore/internal'

import { useStore } from './store'

export const useQuery = <TQuery extends LiveQueryDef.Any>(
  queryDef: TQuery,
  options?: { store: Store }
): Readonly<Ref<LiveQueries.GetResult<TQuery>>> => {
  const { store } = useStore(options)

  const data = ref(store?.query(queryDef) as LiveQueries.GetResult<TQuery>) as Ref<LiveQueries.GetResult<TQuery>>

  const unsubscribe = store?.subscribe(queryDef, {
    onUpdate: (result) => {
      data.value = result
    }
  })
  onUnmounted(() => unsubscribe?.())

  return data
}
