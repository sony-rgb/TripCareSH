import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  @field('email') email!: string
  @field('name') name!: string
  @field('home_city_id') homeCityId!: string
  @field('home_city_name') homeCityName?: string
  @date('updated_at_utc') updatedAtUtc!: Date
}

