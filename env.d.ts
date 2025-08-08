/// <reference types="vite/client" />
import type { Store } from '@livestore/livestore';

export {}

declare global {
  // eslint-disable-next-line no-var
  var __debugLiveStore: Record<string, Store | undefined>;
}
