import { AppState, AppStateStatus } from 'react-native';
import { container } from './container';

/**
 * SyncScheduler manages periodic background sync
 * - Syncs every 1 minute when app is active
 * - Syncs when app comes back to foreground
 * - Handles errors gracefully without blocking UI
 */
class SyncScheduler {
  private syncInterval: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;
  private isRunning: boolean = false;
  private readonly SYNC_INTERVAL_MS = 1 * 60 * 1000; // 1 minute

  /**
   * Start the periodic sync scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('⏭️  [SyncScheduler] Already running, skipping start');
      return;
    }

    console.log('🚀 [SyncScheduler] Starting periodic sync scheduler');
    this.isRunning = true;

    // Set up periodic sync (every 1 minute)
    this.syncInterval = setInterval(() => {
      this.performBackgroundSync('periodic');
    }, this.SYNC_INTERVAL_MS);

    // Set up app state listener (sync when app comes to foreground)
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );

    // Perform initial sync
    this.performBackgroundSync('initial');
  }

  /**
   * Stop the periodic sync scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 [SyncScheduler] Stopping periodic sync scheduler');
    this.isRunning = false;

    // Clear interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Unsubscribe from app state changes
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'active') {
      console.log('📱 [SyncScheduler] App came to foreground, triggering sync');
      this.performBackgroundSync('foreground');
    }
  }

  /**
   * Perform background sync
   * Non-blocking - errors are logged but don't throw
   */
  private async performBackgroundSync(trigger: 'initial' | 'periodic' | 'foreground'): Promise<void> {
    try {
      console.log(`🔄 [SyncScheduler] Starting background sync (trigger: ${trigger})`);
      
      const syncService = container.getSyncService();
      await syncService.sync();
      
      console.log(`✅ [SyncScheduler] Background sync completed (trigger: ${trigger})`);
    } catch (error) {
      console.error(`⚠️ [SyncScheduler] Background sync failed (trigger: ${trigger}):`, error);
      // Don't throw - background sync failures are non-fatal
    }
  }

  /**
   * Manually trigger a sync (e.g., from UI button)
   */
  async triggerManualSync(): Promise<void> {
    console.log('🔄 [SyncScheduler] Manual sync triggered');
    await this.performBackgroundSync('foreground');
  }
}

// Export singleton instance
export const syncScheduler = new SyncScheduler();
export default syncScheduler;

