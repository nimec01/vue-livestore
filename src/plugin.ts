import type { App, Plugin } from 'vue'
import {
  type CreateStoreOptions,
  type LiveStoreSchema,
  createStorePromise,
  type Store
} from '@livestore/livestore'
import {
  withVueApi,
  LiveStoreKey
} from './store'

export const createLiveStore = (
  storeOrOptions: Store | CreateStoreOptions<LiveStoreSchema>
): Plugin => {
  return {
    install(app: App) {
      // Case 1: A ready-made Store instance is passed in – this means we can synchronously
      // provide it and it will be available immediately from `setup()`.
      if (isStoreInstance(storeOrOptions)) {
        const store = withVueApi(storeOrOptions)
        app.provide(LiveStoreKey, store)
        return
      }

      // Case 2: A CreateStoreOptions object – fall back to the previous lazy-init logic.
      let storeInstance: Store | undefined
      const getStore = () => {
        if (!storeInstance) throw new Error('Store not initialized')
        return storeInstance
      }

      app.provide(
        LiveStoreKey,
        new Proxy({} as any, {
          get(_, prop) {
            return (getStore() as any)[prop]
          }
        })
      )

      createStorePromise(storeOrOptions).then((store) => {
        storeInstance = withVueApi(store)
      })
    }
  }
}

// Small type-guard – we just check for a couple of "well-known" store methods.
function isStoreInstance(value: any): value is Store {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.commit === 'function' &&
    typeof value.query === 'function'
  )
}
