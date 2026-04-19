import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class Flight extends Model {
  static table = 'flights'

  @field('user_id') userId!: string
  @field('trip_item_id') tripItemId!: string
  @field('airline') airline!: string
  @field('flight_number') flightNumber!: string
  @field('departure_airport') departureAirport!: string
  @field('arrival_airport') arrivalAirport!: string
  @date('departure_time_local') departureTimeLocal!: Date
  @date('departure_time_utc') departureTimeUtc!: Date
  @date('arrival_time_local') arrivalTimeLocal!: Date
  @date('arrival_time_utc') arrivalTimeUtc!: Date
  @field('confirmation_number') confirmationNumber?: string
  @field('notes') notes?: string
  @date('created_at_utc') createdAtUtc!: Date
  @date('updated_at_utc') updatedAtUtc!: Date

  // Sync tracking fields (client-side only)
  @field('sync_status') dbSyncStatus!: string
  @field('sync_changed') dbSyncChanged!: string
}