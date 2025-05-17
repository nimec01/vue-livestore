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

export const createLiveStore = (options: CreateStoreOptions<LiveStoreSchema>): Plugin => {
  return {
    install(app: App) {

      let storeInstance: Store | undefined

      console.log('createLiveStore', options)
      const getStore = () => {
        if (!storeInstance) throw new Error('Store not initialized')
        return storeInstance
      }

      app.provide(LiveStoreKey, new Proxy({} as any, {
        get(_, prop) {
          return (getStore() as any)[prop]
        }
      }))

      createStorePromise(options).then((store) => {
        storeInstance = withVueApi(store)
      })

    }
  }
}