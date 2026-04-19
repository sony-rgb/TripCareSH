import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class Trip extends Model {
  static table = 'trips'

  @field('user_id') userId!: string
  @field('name') name!: string
  @field('destination') destination!: string
  @field('destination_id') destinationId?: string
  @field('description') description?: string
  @date('start_time') startTime!: Date
  @date('end_time') endTime!: Date
  @date('created_at_utc') createdAtUtc!: Date
  @date('updated_at_utc') updatedAtUtc!: Date

  // Sync tracking fields (client-side only)
  @field('sync_status') dbSyncStatus!: string
  @field('sync_changed') dbSyncChanged!: string
} 