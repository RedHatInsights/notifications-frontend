/**
 * Shared constants for notification threshold configuration
 */

/**
 * The display name for the custom subscription threshold event type.
 * This corresponds to the backend event type name: 'exceeded-custom-utilization-threshold'
 * Note: Using display_name as a temporary solution since the stable 'name' field
 * is not exposed in the frontend types. Consider updating the adapter to include
 * the stable name field for more robust detection.
 */
export const CUSTOM_THRESHOLD_DISPLAY_NAME = 'Custom subscription threshold exceeded';

/**
 * Default threshold percentage when org preferences are not set or loading
 */
export const DEFAULT_THRESHOLD = 80;

/**
 * Timeout for org preferences API calls (in milliseconds)
 */
export const ORG_PREFERENCES_TIMEOUT = 10000; // 10 seconds
