import { Model } from '@nozbe/watermelondb'
import { field, date, relation } from '@nozbe/watermelondb/decorators'

export default class TripItem extends Model {
  static table = 'trip_items'

  // Common fields
  @field('user_id') userId!: string
  @field('trip_id') tripId!: string
  @field('type') type!: string // 'flight', 'activity', 'lodging', etc.
  @field('title') title!: string
  @field('description') description?: string
  @date('start_date') startDate?: Date
  @date('end_date') endDate?: Date
  @field('status') status?: string
  @field('icon') icon!: string
  @field('location') location?: string
  @field('booking_reference') bookingReference?: string
  @field('notes') notes?: string
  @field('price') price?: number
  
  // Timestamps
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Sync tracking fields (client-side only)
  @field('sync_status') dbSyncStatus!: string
  @field('sync_changed') dbSyncChanged!: string

  // Relations
  @relation('trips', 'trip_id') trip!: any
  
  // Helper methods
  isFlight(): boolean {
    return this.type === 'flight'
  }
  
  isActivity(): boolean {
    return this.type === 'activity'
  }
  
  isLodging(): boolean {
    return this.type === 'lodging'
  }
}
