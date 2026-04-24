// Mock @scalprum/react-core for Storybook
// Based on the Jest mock in EmptyNotifications.test.tsx

export const useRemoteHook = () => ({
  hookResult: [null, null],
  loading: false,
});

export const useLoadModule = () => [null, false];
