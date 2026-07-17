/**
 * Test timeout constants
 *
 * These values are tuned for the notifications-frontend micro-frontend app
 * which uses Module Federation and can have longer hydration times.
 */

export const TIMEOUTS = {
  /**
   * Page load timeout - accounts for module federation bundle loading + React hydration
   * Use for: Initial page navigation, heading visibility after page load
   */
  PAGE_LOAD: 180000,

  /**
   * Modal/wizard close timeout - accounts for form submission + API call + close animation
   * Use for: Waiting for wizards/modals to close after submission
   */
  MODAL_CLOSE: 15000,

  /**
   * Table load timeout - accounts for API calls to fetch data
   * Use for: Waiting for tables to load and display data
   */
  TABLE_LOAD: 15000,

  /**
   * Standard element appearance timeout
   * Use for: Buttons, tabs, form fields that should render quickly
   */
  ELEMENT_APPEAR: 10000,

  /**
   * Quick optional element check
   * Use for: Cookie consent, optional features that may not exist
   */
  QUICK_CHECK: 5000,

  /**
   * Backdrop/overlay dismissal timeout
   * Use for: Waiting for modal backdrops to disappear
   */
  BACKDROP_DISMISS: 5000,
} as const;
