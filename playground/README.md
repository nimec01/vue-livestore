# Vue LiveStore - Minimal example

**[!] LiveStore still in private preview - See [LiveStore site](https://livestore.dev/) for updates and information**

This is a minimal example of how to integrate LiveStore with Vue.

I'll start working on a more cohesive Vue interation that implements the useStore, useQuery and useClientDocument composables to match the functionality with the React integration but will leave this repository as it is since it can be useful from a learning perspective.

## Relevant files

**store.ts**: Setup store and defines StoreKey as canonical store reference to provide / inject.

**main.ts**: Creates store and provides the store to the app.

**App.vue**: Injects the store, creates and subscribes to query, commits events.

**livestore/schema.ts**: Same as React example

**livestore/livestore.worker.ts**: same as React example

## Running the example

```bash
pnpm install
pnpm dev
```