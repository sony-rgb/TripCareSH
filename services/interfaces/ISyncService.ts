export interface ISyncService {
  sync(): Promise<void>;
  getLastSyncAt(): number | null;
}