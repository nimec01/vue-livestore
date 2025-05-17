import { createStorePromise } from '@livestore/livestore'
import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'

import LiveStoreWorker from './livestore/livestore.worker?worker'
import { schema } from './livestore/schema'
import type { InjectionKey } from 'vue'

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
})

export const storePromise = createStorePromise({
  schema,
  adapter,
  storeId: 'test_store',
})

export type StoreInstance = Awaited<typeof storePromise>

export const StoreKey = Symbol('LiveStore') as InjectionKey<StoreInstance>
