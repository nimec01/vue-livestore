# Vue bindings for LiveStore

**[!] LiveStore still in private preview - See [LiveStore site](https://livestore.dev/) for updates and information**

Currently in beta with plan to mature alongside LiveStore. Happy to accept suggestions for improvement and contributions. See list of todos below for pending areas.

## Installation
**Install LiveStore**
```bash
pnpm install @livestore/livestore @livestore/wa-sqlite@1.0.5-dev.2 @livestore/adapter-web @livestore/utils @livestore/peer-deps @livestore/devtools-vite
```
**Install vue-livestore**
```bash
pnpm install vue-livestore
```

## Key components:

**LiveStoreProvider**: Creates the store and provides it to the rest of the wrapped app.

**useStore()**: Composables to load (inject) the store

**useQuery()**: Composable to create reactive read-only live queries

## Usage

**For full working example see code in [playground](https://github.com/slashv/vue-livestore/tree/main/playground).**

Follow the [React Web example for an existing project](https://docs.livestore.dev/getting-started/react-web/#existing-project-setup) on the LiveStore docs to:
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

```ts
import { queryDb } from '@livestore/livestore'
import { events, tables } from '../livestore/schema'
import { useStore, useQuery } from 'vue-livestore'

const { store } = useStore()

const visibleTodos$ = queryDb(
  () => tables.todos.where({ deletedAt: null, })
  { label: 'visibleTodos' },
)
const todosQuery = useQuery(visibleTodos$)

store.commit(events.todoCreated({ id: crypto.randomUUID(), text: "Write documentation" }))
```

## TODO
- [ ] Multiple stores support
- [ ] useClientDocument composable
- [ ] Nuxt integration (might be separate repo or just example implementation)

## Comments
**Why not a Vue plugin instead of provider pattern?**
A Vue plugin would probably be more idiomatic to the Vue ecosystem but a provider has the benefit of easily designating a loading slot. It also matches better to the React implementation for LiveStore which makes generalising examples easier. It's possible as this package matures we might switch to a plugin structure if it makes sense. We would also see what the best option would be when integrating into Nuxt.