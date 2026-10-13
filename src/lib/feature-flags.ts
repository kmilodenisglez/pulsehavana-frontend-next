"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

export const FeatureFlagsSchema = z.object({
  showUserShortcuts: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

export const defaultFeatureFlags: FeatureFlags = {
  showUserShortcuts: false,
};

export const clientFeatureFlags: Partial<FeatureFlags> = {
  showUserShortcuts: process.env.NEXT_PUBLIC_FEATURE_SHOW_USER_SHORTCUTS === "true",
};

export type FeatureFlagService = {
  getAll: () => Promise<FeatureFlags>;
  getByKey: (key: keyof FeatureFlags) => Promise<FeatureFlags[keyof FeatureFlags]>;
};

export function resolveFeatureFlags(
  overrides: Partial<FeatureFlags> = clientFeatureFlags,
): FeatureFlags {
  return FeatureFlagsSchema.parse({
    ...defaultFeatureFlags,
    ...overrides,
  });
}

export function createFeatureFlagService(
  fetcher?: () => Promise<Partial<FeatureFlags> | null | undefined>,
): FeatureFlagService {
  const service: FeatureFlagService = {
    getAll: async () => {
      const remoteFlags = fetcher ? await fetcher() : undefined;
      return resolveFeatureFlags(remoteFlags ?? clientFeatureFlags);
    },
    getByKey: async (key) => {
      const nextFlags = await service.getAll();
      return nextFlags[key];
    },
  };

  return service;
}

export const featureFlagService = createFeatureFlagService();

export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(() => resolveFeatureFlags());

  useEffect(() => {
    let isMounted = true;

    void featureFlagService.getAll().then((nextFlags) => {
      if (isMounted) {
        setFlags(nextFlags);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return flags;
}
