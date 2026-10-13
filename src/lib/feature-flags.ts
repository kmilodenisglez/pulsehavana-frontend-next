"use client";

import { useEffect, useState } from "react";

export type FeatureFlags = {
  showUserShortcuts: boolean;
};

const defaultFeatureFlags = {
  showUserShortcuts: false,
} satisfies FeatureFlags;

export const clientFeatureFlags: Partial<FeatureFlags> = {
  showUserShortcuts: false,
};

export type FeatureFlagService = {
  getAll: () => FeatureFlags | Promise<FeatureFlags>;
};

export const featureFlagService: FeatureFlagService = {
  getAll: () => ({
    ...defaultFeatureFlags,
    ...clientFeatureFlags,
  }),
};

export function resolveFeatureFlags(
  overrides: Partial<FeatureFlags> = clientFeatureFlags,
): FeatureFlags {
  return {
    ...defaultFeatureFlags,
    ...overrides,
  };
}

export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(() => resolveFeatureFlags());

  useEffect(() => {
    let isMounted = true;

    Promise.resolve(featureFlagService.getAll()).then((nextFlags) => {
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
