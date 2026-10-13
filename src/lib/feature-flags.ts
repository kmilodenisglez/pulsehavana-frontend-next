export type FeatureFlags = {
  showUserShortcuts: boolean;
};

export const featureFlags = {
  showUserShortcuts: false,
} satisfies FeatureFlags;
