import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class ActivityItem extends Model {
  static table = 'activity_items'

  @field('user_id') userId!: string
  @field('trip_item_id') tripItemId!: string
  @field('title') title!: string
  @field('description') description?: string
  @field('venue') venue?: string
  @field('address') address?: string
  @date('start_date') startDate!: Date
  @field('start_time') startTime?: string
  @date('end_date') endDate?: Date
  @field('end_time') endTime?: string
  @field('is_completed') isCompleted?: boolean
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Sync tracking fields (client-side only)
  @field('sync_status') dbSyncStatus!: string
  @field('sync_changed') dbSyncChanged!: string
}

