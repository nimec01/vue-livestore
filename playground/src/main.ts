import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'
import { createLiveStore } from 'vue-livestore'

import { schema } from './livestore/schema'
import LiveStoreWorker from './livestore/livestore.worker?worker'

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
})

const app = createApp(App)
app.use(createLiveStore({
  schema,
  adapter,
  storeId: 'test_store'
}))
app.mount('#app')
