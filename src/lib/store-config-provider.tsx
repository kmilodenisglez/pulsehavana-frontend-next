"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultStoreConfig, type StoreConfig } from "./store-config";

const StoreConfigContext = createContext<StoreConfig>(defaultStoreConfig);

/**
 * Shares the server-resolved business configuration with Client Components.
 *
 * `config` is resolved once in the root layout, so it is already present on the
 * first render: no provider-side fetch, no hydration flash and no duplicated
 * values in the components.
 */
export function StoreConfigProvider({
  config,
  children,
}: {
  config: StoreConfig;
  children: ReactNode;
}) {
  return <StoreConfigContext.Provider value={config}>{children}</StoreConfigContext.Provider>;
}

/** Business configuration resolved by the server. Never hardcode these values. */
export function useStoreConfig(): StoreConfig {
  return useContext(StoreConfigContext);
}
