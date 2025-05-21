# Vue bindings for LiveStore

**[!] LiveStore still in private preview - See [LiveStore site](https://livestore.dev/) for updates and information**

This is still an early version of Vue bindings for LiveStore. Haven't published the package on npm yet because not sure if the LiveStore project would prefer it to be integrated into the main LiveStore repo as is the case for React, Solid, Expo etc.

## Key components:

**LiveStoreProvider**: Creates the store and provides it to the rest of the wrapped app.

**useStore()**: Composables to load (inject) the store

**useQuery()**: Composable to create reactive read-only live queries

## Usage

**For full working example see code in playground.**

Follow the [React Web example](https://dev.docs.livestore.dev/getting-started/react-web/) on the LiveStore docs to:
1. Adjust Vite config
2. Create livestore/livestore.worker.ts
3. Create livestore/schema.ts

### Wrap your app in a LiveStoreProvider

```vue
<template>
  <LiveStoreProvider :options="{ schema, adapter, storeId }">
    <Todos />
  </LiveStoreProvider>
</template>
```

### useStore and useQuery composables

```vue
import { queryDb } from '@livestore/livestore'
import { events, tables } from '../livestore/schema'
import { useStore, useQuery } from 'vue-livestore'

const { store } = useStore()

const visibleTodos$ = queryDb(
  (get) => {
    return tables.todos.where({
      deletedAt: null,
    })
  },
  { label: 'visibleTodos' },
)
const todosQuery = useQuery(visibleTodos$)

store.commit(events.todoCreated({ id: crypto.randomUUID(), text: "Write documentation" }))
```

## TODO
- [ ] useClientDoument composable
- [x] tests

## Comments
**Why not a Vue plugin instead of a provider?**
Plugins are more common in the Vue ecosystem so I started by implementing the store creation logic as a Vue plugin but I ran into some problems because plugin code can't be async as I understand it. There probably is a way to solve that but I also think the provider pattern works very well in this scenario because it makes it easy to define a loading state and aligns well with the React LiveStore integration.