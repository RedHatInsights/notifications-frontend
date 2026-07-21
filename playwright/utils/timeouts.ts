/**
 * Symbolic timeout constants for E2E tests — eliminates magic numbers.
 *
 * Shared across all spec files and drawer-helpers so that every wait/poll
 * uses a named constant instead of a bare number.
 */
export const TIMEOUTS = {
  /** Chrome shell + federated module initial load */
  CHROME_LOAD: 60_000,
  /** Drawer panel load (spinner disappears, content ready) */
  DRAWER_LOAD: 30_000,
  /** Drawer header / content visibility after open */
  DRAWER_CONTENT: 15_000,
  /** API response polling (mark read/unread state changes) */
  API_POLL: 10_000,
  /** UI interaction feedback (dropdown visible, checkbox state, tooltip) */
  UI_FEEDBACK: 5_000,
  /** SPA client-side page navigation */
  NAVIGATION: 30_000,
} as const;
