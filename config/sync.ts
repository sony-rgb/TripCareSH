/**
 * Sync Configuration
 * Central place for sync-related constants and configurations
 */

/**
 * How stale the last sync can be before triggering a new sync (in minutes).
 * If lastSyncAt is older than this, sync will be triggered automatically.
 */
export const SYNC_STALE_THRESHOLD_MINUTES = 15;

/**
 * Debounce time for sync triggers (in milliseconds).
 * Prevents multiple sync triggers from overlapping.
 */
export const SYNC_DEBOUNCE_MS = 2000;

/**
 * Foreground sync interval (in milliseconds).
 * How often sync runs while the app is active.
 */
export const SYNC_FOREGROUND_INTERVAL_MS = 1 * 60 * 1000; // 1 minute

/**
 * Background sync minimum interval (in seconds).
 * Note: iOS may run tasks less frequently; this is the minimum requested interval.
 * Android uses WorkManager which respects this more closely.
 */
export const SYNC_BACKGROUND_INTERVAL_SECONDS = 15 * 60; // 15 minutes

/**
 * Task name for background sync.
 */
export const BACKGROUND_SYNC_TASK_NAME = 'tripcare-background-sync';

/**
 * Temporary kill switch to disable sync (set true to disable).
 */
export const SYNC_DISABLED = false;

