import { defineComponent, provide, ref, type PropType } from 'vue'
import {
  type CreateStoreOptions,
  type LiveStoreSchema,
  type Store,
  createStorePromise
} from '@livestore/livestore'
import { LiveStoreKey, withVueApi } from './store'

export const LiveStoreProvider = defineComponent({
  name: 'LiveStoreProvider',
  props: {
    options: {
      type: Object as PropType<CreateStoreOptions<LiveStoreSchema>>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const storeRef = ref<Store>()

    // Inject a proxy immediately so that useStore() can be called while loading.
    provide(
      LiveStoreKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Proxy({} as any, {
        get(_, key) {
          if (!storeRef.value) throw new Error('LiveStore not initialized yet')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore – dynamic access
          return storeRef.value[key]
        },
      }),
    )

    // Initiate async store creation
    createStorePromise(props.options).then((store) => {
      storeRef.value = withVueApi(store)
    })

    return () => {
      if (!storeRef.value) {
        return slots.loading ? slots.loading() : null
      }
      return slots.default ? slots.default() : []
    }
  },
})
