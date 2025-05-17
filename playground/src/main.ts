import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'
import { createLiveStore } from 'vue-livestore'

import { schema } from './livestore/schema'
import LiveStoreWorker from './livestore/livestore.worker?worker'

import { createStorePromise } from '@livestore/livestore'

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
})

// Initialise the LiveStore instance *before* we create the Vue application.
// This guarantees that the store is available synchronously from `setup()`.
createStorePromise({
  schema,
  adapter,
  storeId: 'test_store'
}).then((store) => {
  const app = createApp(App)
  // Cast to any to work around mismatched typings during local dev build
  app.use(createLiveStore(store as any))
  app.mount('#app')
})
