import database from './init'
import Trip from './model/Trip'
import TripItem from './model/TripItem'
import User from './model/User'
import { runMigrations, checkMigrationStatus } from './migrationRunner'

const SEED_USER_ID = 'seed-user'
const SEED_USER_PROFILE = {
  id: SEED_USER_ID,
  email: 'seed+user@tripcare.dev',
  name: 'Seed User',
  home_city_id: 'seed-city',
  home_city_name: 'Seed City',
}

const ensureSeedUserExists = async () => {
  const usersCollection = database.get<User>('users')
  const existing = await usersCollection.query().fetch()

  // If a user with the target id already exists, just update basic fields
  const matching = existing.find(u => u.id === SEED_USER_ID)
  if (matching) {
    await database.write(async () => {
      await matching.update(u => {
        u.email = SEED_USER_PROFILE.email
        u.name = SEED_USER_PROFILE.name
        u.homeCityId = SEED_USER_PROFILE.home_city_id
        u.homeCityName = SEED_USER_PROFILE.home_city_name
        u.updatedAtUtc = new Date()
      })
    })
    return matching
  }

  // Otherwise, create the seed user (and keep any others as-is)
  return await database.write(async () => {
    return await usersCollection.create(u => {
      u._raw.id = SEED_USER_PROFILE.id // enforce the UUID/id to match child tables
      u.email = SEED_USER_PROFILE.email
      u.name = SEED_USER_PROFILE.name
      u.homeCityId = SEED_USER_PROFILE.home_city_id
      u.homeCityName = SEED_USER_PROFILE.home_city_name
      u.updatedAtUtc = new Date()
    })
  })
}

export const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding process...')
    
    // First, run any pending migrations
    await runMigrations()

    // Ensure a seed user exists so child rows reference a real user id
    await ensureSeedUserExists()
    
    // Then seed the trips
    await seedTrips()
    
    // Finally seed trip items
    await seedTripItems()
    
    // Check if trip items were created successfully
    await checkTripItems()
    
    console.log('✅ Database seeding completed successfully')
  } catch (error) {
    console.error('❌ Error during database seeding:', error)
    throw error
  }
}

export const seedTrips = async () => {
  const trips = [
    {
      name: 'Summer Vacation',
      description: 'Our annual family summer vacation to the beautiful city of Florence, Italy. This trip promises to be an unforgettable experience filled with art, culture, and delicious Italian cuisine. We\'ll be exploring the historic city center, visiting world-famous museums, and enjoying the warm Mediterranean weather.\n\nFlorence is known as the birthplace of the Renaissance, and we\'re excited to immerse ourselves in its rich history and artistic heritage. From the iconic Duomo to the charming Ponte Vecchio, every corner of this city tells a story.',
      startDate: new Date('2025-07-15'),
      endDate: new Date('2025-07-30'),
      destinationCityName: 'Florence, Italy',
    },
    {
      name: 'Business Conference',
      description: 'Attending the annual Tech Innovation Summit in Santorini, Greece. This prestigious conference brings together industry leaders, innovators, and technology enthusiasts from around the world. The event will feature keynote speeches, panel discussions, and networking opportunities.\n\nThe conference will be held at a stunning venue overlooking the Aegean Sea, providing the perfect backdrop for productive discussions and creative thinking. In addition to the professional program, there will be cultural events and social gatherings to foster meaningful connections.',
      startDate: new Date('2025-08-05'),
      endDate: new Date('2025-08-12'),
      destinationCityName: 'Santorini, Greece',
    },
    {
      name: 'Weekend Getaway',
      description: 'A quick weekend escape to Sydney, Australia to recharge and explore this vibrant coastal city. We\'ll be staying in the heart of the city, just steps away from the iconic Sydney Opera House and the beautiful Sydney Harbour.\n\nOur weekend will be packed with activities including a harbor cruise, visits to local markets, and sampling the city\'s famous coffee culture. Sydney\'s unique blend of urban sophistication and natural beauty makes it the perfect destination for a short but memorable getaway.',
      startDate: new Date('2025-08-08'),
      endDate: new Date('2025-08-10'),
      destinationCityName: 'Sydney, Australia',
    },
    {
      name: 'Hiking Adventure',
      description: 'An exciting mountain hiking and nature exploration trip in the beautiful Canadian Rockies near Toronto. This adventure will take us through pristine wilderness areas, offering breathtaking views of snow-capped peaks, crystal-clear lakes, and dense forests.\n\nWe\'ll be hiking various trails of different difficulty levels, from easy scenic walks to challenging mountain ascents. The trip includes guided tours, wildlife spotting opportunities, and overnight stays in mountain lodges. This is the perfect opportunity to disconnect from technology and reconnect with nature.',
      startDate: new Date('2025-08-09'),
      endDate: new Date('2025-08-15'),
      destinationCityName: 'Toronto, Canada',
    },
    {
      name: 'Cultural Tour',
      description: 'A comprehensive cultural tour of Melbourne, Australia, focusing on the city\'s rich arts scene, diverse culinary landscape, and fascinating history. Melbourne is known for its vibrant street art, world-class museums, and multicultural neighborhoods.\n\nOur tour will include visits to the National Gallery of Victoria, the Royal Botanic Gardens, and various cultural precincts. We\'ll also explore the city\'s famous laneways, sample local cuisine at food markets, and attend cultural performances. Melbourne\'s unique blend of European elegance and Australian informality creates a truly special atmosphere.',
      startDate: new Date('2025-08-12'),
      endDate: new Date('2025-08-18'),
      destinationCityName: 'Melbourne, Australia',
    },
    {
      name: 'Beach Holiday',
      description: 'A relaxing beach vacation in Barcelona, Spain, combining sun, sea, and Spanish culture. We\'ll be staying at a beachfront resort with direct access to the Mediterranean Sea, perfect for swimming, sunbathing, and water sports.\n\nBarcelona offers the perfect mix of beach relaxation and cultural exploration. We\'ll visit the famous Sagrada Familia, stroll along Las Ramblas, and explore the Gothic Quarter. The city\'s vibrant nightlife, delicious tapas, and warm Mediterranean climate make it an ideal destination for both relaxation and adventure.',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-08'),
      destinationCityName: 'Barcelona, Spain',
    },
    {
      name: 'Ski Trip',
      description: 'An exhilarating winter skiing adventure in the mountains near Vancouver, Canada. This trip will take us to some of the best ski resorts in North America, offering pristine powder snow and world-class facilities.\n\nWe\'ll be skiing various runs suitable for different skill levels, from gentle beginner slopes to challenging black diamond trails. The trip includes ski equipment rental, professional instruction, and comfortable mountain accommodation. After a day on the slopes, we\'ll enjoy après-ski activities, hot tubs, and cozy mountain dining.',
      startDate: new Date('2025-12-20'),
      endDate: new Date('2025-12-27'),
      destinationCityName: 'Vancouver, Canada',
    },
    {
      name: 'Food Tour',
      description: 'A culinary exploration of Tokyo, Japan, focusing on the city\'s diverse and sophisticated food culture. Tokyo is home to more Michelin-starred restaurants than any other city in the world, making it a paradise for food lovers.\n\nOur tour will include visits to traditional sushi restaurants, ramen shops, and modern fusion eateries. We\'ll explore the famous Tsukiji Fish Market, participate in cooking classes, and sample street food in various neighborhoods. The trip will also include visits to sake breweries and tea ceremonies, providing a comprehensive understanding of Japanese culinary traditions.',
      startDate: new Date('2025-08-07'),
      endDate: new Date('2025-08-11'),
      destinationCityName: 'Tokyo, Japan',
    },
    {
      name: 'Photography Expedition',
      description: 'A photography expedition to Cape Town, South Africa, capturing the stunning landscapes, diverse wildlife, and vibrant city life. This trip is designed for photography enthusiasts of all skill levels, with professional guidance and access to some of the most photogenic locations in Africa.\n\nWe\'ll be photographing the iconic Table Mountain, the colorful Bo-Kaap neighborhood, and the dramatic Cape Point. The expedition includes wildlife photography opportunities, landscape workshops, and city street photography sessions. Cape Town\'s unique light and diverse subjects provide endless opportunities for creating stunning images.',
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-25'),
      destinationCityName: 'Cape Town, South Africa',
    },
    {
      name: 'Music Festival',
      description: 'Attending an international music festival in Berlin, Germany, featuring world-renowned artists and emerging talent from various genres. This festival is known for its innovative programming, stunning venues, and vibrant atmosphere.\n\nThe festival will take place across multiple venues throughout the city, from historic concert halls to modern outdoor stages. In addition to the main performances, there will be workshops, meet-and-greet sessions, and cultural events. Berlin\'s rich musical heritage and contemporary scene make it the perfect host city for this celebration of music.',
      startDate: new Date('2025-08-06'),
      endDate: new Date('2025-08-09'),
      destinationCityName: 'Berlin, Germany',
    },
    {
      name: 'Volunteer Trip',
      description: 'A meaningful volunteer trip to Bangkok, Thailand, focusing on community service and cultural exchange. This trip combines humanitarian work with cultural immersion, providing a unique opportunity to give back while learning about Thai culture and traditions.\n\nWe\'ll be working with local organizations on various community projects, including education, environmental conservation, and social welfare initiatives. The trip includes cultural workshops, language lessons, and visits to historical sites. This experience will not only help local communities but also provide valuable insights into Thai society and create lasting connections.',
      startDate: new Date('2025-09-10'),
      endDate: new Date('2025-09-20'),
      destinationCityName: 'Bangkok, Thailand',
    },
    {
      name: 'Road Trip',
      description: 'An epic cross-country road trip from the East Coast to Los Angeles, USA, exploring the diverse landscapes and cultures of America. This journey will take us through multiple states, national parks, and iconic landmarks.\n\nWe\'ll be driving through the scenic Appalachian Mountains, the vast Great Plains, the majestic Rocky Mountains, and the stunning Southwest deserts. The trip includes visits to national parks, historic sites, and quirky roadside attractions. This road trip promises to be an unforgettable adventure filled with stunning scenery, interesting encounters, and the freedom of the open road.',
      startDate: new Date('2025-08-10'),
      endDate: new Date('2025-08-18'),
      destinationCityName: 'Los Angeles, USA',
    },
    {
      name: 'Luxury Cruise',
      description: 'A premium cruise experience from Dubai to the Mediterranean, featuring all-inclusive amenities and world-class service. This luxury cruise will take us through the Arabian Gulf, the Red Sea, and the Mediterranean, visiting some of the most beautiful ports in the region.\n\nThe cruise ship offers multiple restaurants, spa facilities, entertainment venues, and recreational activities. We\'ll visit exotic ports including Muscat, Aqaba, Alexandria, and various Mediterranean destinations. The combination of luxury accommodation, gourmet dining, and fascinating shore excursions creates the ultimate travel experience.',
      startDate: new Date('2025-08-20'),
      endDate: new Date('2025-09-02'),
      destinationCityName: 'Dubai, UAE',
    },
    {
      name: 'Backpacking Adventure',
      description: 'A budget-friendly backpacking adventure through multiple European cities, exploring the continent\'s rich history, diverse cultures, and stunning architecture. This trip is designed for adventurous travelers who want to experience authentic local life.\n\nWe\'ll be staying in hostels, using public transportation, and eating at local markets and family-run restaurants. The journey will take us through Amsterdam, Paris, Rome, and other iconic European destinations. This backpacking trip emphasizes cultural immersion, meeting fellow travelers, and discovering hidden gems off the beaten path.',
      startDate: new Date('2025-09-25'),
      endDate: new Date('2025-10-10'),
      destinationCityName: 'Amsterdam, Netherlands',
    },
    {
      name: 'Family Reunion',
      description: 'An annual family gathering and celebration in New York City, bringing together relatives from around the world for a week of connection, celebration, and shared experiences. New York provides the perfect backdrop for our family reunion with its diverse attractions and activities.\n\nWe\'ll be staying in a spacious apartment in Manhattan, allowing us to cook family meals together and spend quality time. The reunion includes visits to iconic landmarks, Broadway shows, family photo sessions, and special dinners at renowned restaurants. This gathering will strengthen family bonds and create lasting memories for generations to come.',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-25'),
      destinationCityName: 'New York, USA',
    }
  ]

  try {
    await database.write(async () => {
      for (const tripData of trips) {
        await database.get('trips').create((trip: any) => {
          trip.userId = SEED_USER_ID
          trip.name = tripData.name
          trip.destination = tripData.destinationCityName
          trip.destinationId = tripData.destinationCityName // Using city name as ID for now
          trip.description = tripData.description
          trip.startTime = tripData.startDate
          trip.endTime = tripData.endDate
          trip.dbSyncStatus = 'synced'
          trip.dbSyncChanged = ''
        })
      }
    })
    console.log('✅ Successfully seeded trips database with', trips.length, 'trips')
  } catch (error) {
    console.error('❌ Error seeding trips:', error)
  }
}

export const seedTripItems = async () => {
  try {
    console.log('🚀 Starting trip items seeding...')
    
    // Get all trips to associate trip items with
    const trips = await database.get('trips').query().fetch()
    console.log('📋 Found', trips.length, 'trips to associate items with')
    
    if (trips.length === 0) {
      console.log('⚠️ No trips found. Skipping trip items seeding.')
      return
    }

    console.log('🔍 Trip IDs available:', trips.map(t => t.id))

    const tripItems = [
      // Sample trip items for the first trip (Summer Vacation)
      {
        tripId: trips[0].id,
        type: 'Flight',
        title: 'Flight to Florence',
        description: 'Direct flight from our home airport to Florence International Airport (FLR). We\'ve booked business class seats for maximum comfort during this long-haul journey. The flight will take approximately 8 hours, crossing the Atlantic and providing stunning aerial views of the Mediterranean coast as we approach Italy.\n\nOur flight includes complimentary meals, entertainment, and priority boarding. We\'ll arrive in Florence in the early afternoon, giving us plenty of time to settle into our accommodation and begin exploring the city. The airline has confirmed our seats and provided us with detailed information about baggage allowances and check-in procedures.',
        startDate: new Date('2025-07-15T10:00:00Z'),
        endDate: new Date('2025-07-15T14:30:00Z'),
        location: 'Florence International Airport (FLR)',
        status: 'Booked',
        icon: 'plane',
        bookingReference: 'FL123456',
        price: 450.00,
        notes: 'Check-in 2 hours before departure. Business class lounge access included. Priority baggage handling confirmed.'
      },
      {
        tripId: trips[0].id,
        type: 'Hotel',
        title: 'Hotel Florence Central',
        description: 'Luxurious 4-star hotel located in the heart of Florence\'s historic center, just a 5-minute walk from the iconic Duomo and within easy reach of all major attractions. The hotel occupies a beautifully restored 15th-century building that combines Renaissance architecture with modern amenities.\n\nOur deluxe room features a private balcony overlooking the city, king-size bed, marble bathroom with rain shower, and complimentary Wi-Fi. The hotel offers a rooftop terrace with panoramic views, an elegant restaurant serving traditional Tuscan cuisine, and a wellness center with spa treatments. Daily breakfast is included, featuring fresh local produce and Italian specialties.',
        startDate: new Date('2025-07-15T15:00:00Z'),
        endDate: new Date('2025-07-30T11:00:00Z'),
        location: 'Via Roma 123, Florence, Italy',
        status: 'Confirmed',
        icon: 'bed',
        bookingReference: 'HF789012',
        price: 1200.00,
        notes: 'Early check-in available. Room upgrade to deluxe with city view confirmed. Airport transfer service can be arranged.'
      },
      {
        tripId: trips[0].id,
        type: 'Activity',
        title: 'Uffizi Gallery Tour',
        description: 'Guided tour of the world-famous Uffizi Gallery, home to one of the most important collections of Renaissance art in the world. Our expert guide will lead us through the gallery\'s magnificent halls, sharing fascinating stories about the masterpieces and their creators.\n\nThe tour includes skip-the-line access, allowing us to bypass the long queues that are common at this popular attraction. We\'ll see iconic works by Botticelli, Michelangelo, Leonardo da Vinci, and other Renaissance masters. The tour lasts approximately 3 hours and includes detailed explanations of the historical and artistic significance of each piece. Photography is permitted in most areas, and our guide will point out the best spots for capturing memorable photos.',
        startDate: new Date('2025-07-16T09:00:00Z'),
        endDate: new Date('2025-07-16T12:00:00Z'),
        location: 'Uffizi Gallery, Florence',
        status: 'Booked',
        icon: 'calendar',
        bookingReference: 'UG345678',
        price: 75.00,
        notes: 'Meet at main entrance 15 minutes before tour time. Audio headsets provided. Tour conducted in English. Comfortable walking shoes recommended.'
      },
      {
        tripId: trips[0].id,
        type: 'Car Rental',
        title: 'Car Rental - Florence',
        description: 'Compact car rental for day trips to the beautiful Tuscan countryside and nearby cities like Siena, Pisa, and San Gimignano. We\'ve chosen a fuel-efficient vehicle that\'s perfect for navigating the narrow streets of Italian towns and the winding roads of Tuscany.\n\nThe rental includes comprehensive insurance coverage, GPS navigation system, and unlimited mileage. We\'ll pick up the car from the airport location and return it there at the end of our trip. The vehicle comes equipped with air conditioning, automatic transmission, and all necessary safety features. Our rental package also includes roadside assistance and 24/7 customer support.',
        startDate: new Date('2025-07-17T08:00:00Z'),
        endDate: new Date('2025-07-17T18:00:00Z'),
        location: 'Florence Airport Car Rental',
        status: 'Planned',
        icon: 'car',
        bookingReference: 'CR901234',
        price: 45.00,
        notes: 'International driving permit required. Valid credit card needed for deposit. Fuel policy: return with same amount. Parking available at hotel for additional fee.'
      },

      // Sample trip items for the second trip (Business Conference)
      {
        tripId: trips[1].id,
        type: 'Flight',
        title: 'Flight to Santorini',
        description: 'Business class flight to Santorini International Airport (JTR) for the Tech Innovation Summit. This premium flight service includes priority check-in, access to exclusive lounges, and enhanced onboard amenities designed for business travelers.\n\nThe flight duration is approximately 6 hours, with a brief layover in Athens. We\'ll have access to power outlets, high-speed Wi-Fi, and a selection of business publications. The airline provides a gourmet meal service and complimentary beverages throughout the journey. Upon arrival, we\'ll be greeted by conference organizers who will assist with transportation to our accommodation.',
        startDate: new Date('2025-08-05T08:00:00Z'),
        endDate: new Date('2025-08-05T12:00:00Z'),
        location: 'Santorini International Airport (JTR)',
        status: 'Booked',
        icon: 'plane',
        bookingReference: 'SS567890',
        price: 650.00,
        notes: 'Business class upgrade confirmed. Lounge access included. Conference transfer service arranged. Priority baggage handling.'
      },
      {
        tripId: trips[1].id,
        type: 'Hotel',
        title: 'Conference Hotel Santorini',
        description: 'Exclusive conference venue and accommodation located in the heart of Santorini\'s business district, offering stunning views of the Aegean Sea and the island\'s famous caldera. The hotel is specifically designed to host international conferences and business events.\n\nOur executive suite features a private balcony, separate living area, work desk with high-speed internet, and premium amenities. The hotel includes state-of-the-art conference facilities, multiple meeting rooms, and a business center. The conference package includes all meals, coffee breaks, and networking events. The hotel also offers a fitness center, spa services, and outdoor swimming pool for relaxation between sessions.',
        startDate: new Date('2025-08-05T14:00:00Z'),
        endDate: new Date('2025-08-12T11:00:00Z'),
        location: 'Conference Center, Santorini',
        status: 'Confirmed',
        icon: 'bed',
        bookingReference: 'CHS123456',
        price: 1400.00,
        notes: 'Conference package includes meals and events. Executive suite upgrade confirmed. Airport transfer included. Business center access 24/7.'
      },
      {
        tripId: trips[1].id,
        type: 'Activity',
        title: 'Tech Conference 2025',
        description: 'Annual technology conference featuring keynote speeches from industry leaders, interactive panel discussions, and networking opportunities with professionals from around the world. The conference focuses on emerging technologies, innovation strategies, and future trends in the tech industry.\n\nThe three-day event includes workshops on artificial intelligence, sustainable technology, and digital transformation. Each day features multiple tracks allowing attendees to customize their experience based on their interests and expertise. The conference also includes a technology showcase, startup pitch sessions, and exclusive networking dinners. All sessions are recorded and available for post-conference viewing.',
        startDate: new Date('2025-08-06T09:00:00Z'),
        endDate: new Date('2025-08-08T17:00:00Z'),
        location: 'Santorini Conference Center',
        status: 'Confirmed',
        icon: 'calendar',
        bookingReference: 'TC2025',
        price: 800.00,
        notes: 'Conference badge pickup at registration desk. All-access pass includes workshops and networking events. Business cards recommended for networking sessions.'
      }
    ]

    console.log('📝 Creating', tripItems.length, 'trip items...')

    await database.write(async () => {
      for (const itemData of tripItems) {
        console.log('➕ Creating trip item:', itemData.title, 'for trip:', itemData.tripId)
        await database.get('trip_items').create((item: any) => {
          item.userId = SEED_USER_ID
          item.tripId = itemData.tripId
          item.type = itemData.type
          item.title = itemData.title
          item.startDate = itemData.startDate
          item.endDate = itemData.endDate
          item.status = itemData.status
          item.icon = itemData.icon
          item.dbSyncStatus = 'synced'
          item.dbSyncChanged = ''
        })
      }
    })

    console.log('✅ Successfully seeded trip items database with', tripItems.length, 'items')
  } catch (error) {
    console.error('❌ Error seeding trip items:', error)
  }
}

export const clearTrips = async () => {
  try {
    await database.write(async () => {
      const allTrips = await database.get('trips').query().fetch()
      for (const trip of allTrips) {
        await trip.destroyPermanently()
      }
    })
    console.log('✅ Successfully cleared all trips from database')
  } catch (error) {
    console.error('❌ Error clearing trips:', error)
  }
}

export const checkTripItems = async () => {
  try {
    console.log('🔍 Checking trip items in database...')
    const allTripItems = await database.get('trip_items').query().fetch()
    console.log('📊 Total trip items in database:', allTripItems.length)
    
    if (allTripItems.length > 0) {
      console.log('📋 Trip items found:')
      allTripItems.forEach((item: any, index: number) => {
        console.log(`${index + 1}. ${item.title} (${item.type}) - Trip ID: ${item.tripId}`)
      })
    } else {
      console.log('⚠️ No trip items found in database')
    }
    
    return allTripItems
  } catch (error) {
    console.error('❌ Error checking trip items:', error)
    return []
  }
}

export const checkTrips = async () => {
  try {
    console.log('🔍 Checking trips in database...')
    const allTrips = await database.get('trips').query().fetch()
    console.log('📊 Total trips in database:', allTrips.length)
    
    if (allTrips.length > 0) {
      console.log('📋 Trips found:')
      allTrips.forEach((trip: any, index: number) => {
        console.log(`${index + 1}. ${trip.name} - ID: ${trip.id} - Destination: ${trip.destination}`)
      })
    } else {
      console.log('⚠️ No trips found in database')
    }
    
    return allTrips
  } catch (error) {
    console.error('❌ Error checking trips:', error)
    return []
  }
}

export const createTripItemsForTrip = async (tripId: string) => {
  try {
    console.log('🚀 Creating trip items for trip ID:', tripId)
    
    const tripItems = [
      {
        tripId: tripId,
        type: 'Flight',
        title: 'Flight to Destination',
        startDate: new Date('2025-08-09T10:00:00Z'),
        endDate: new Date('2025-08-09T14:30:00Z'),
        status: 'Booked',
        icon: 'plane'
      },
      {
        tripId: tripId,
        type: 'Hotel',
        title: 'Hotel Booking',
        startDate: new Date('2025-08-09T15:00:00Z'),
        endDate: new Date('2025-08-12T11:00:00Z'),
        status: 'Confirmed',
        icon: 'bed'
      },
      {
        tripId: tripId,
        type: 'Activity',
        title: 'City Tour',
        startDate: new Date('2025-08-10T09:00:00Z'),
        endDate: new Date('2025-08-10T12:00:00Z'),
        status: 'Booked',
        icon: 'calendar'
      },
      {
        tripId: tripId,
        type: 'Car Rental',
        title: 'Car Rental',
        startDate: new Date('2025-08-11T08:00:00Z'),
        endDate: new Date('2025-08-11T18:00:00Z'),
        status: 'Planned',
        icon: 'car'
      }
    ]

    console.log('📝 Creating', tripItems.length, 'trip items for trip', tripId)

    await database.write(async () => {
      for (const itemData of tripItems) {
        console.log('➕ Creating trip item:', itemData.title)
        await database.get('trip_items').create((item: any) => {
          item.tripId = itemData.tripId
          item.type = itemData.type
          item.title = itemData.title
          item.startDate = itemData.startDate
          item.endDate = itemData.endDate
          item.status = itemData.status
          item.icon = itemData.icon
          item.dbSyncStatus = 'synced'
          item.dbSyncChanged = ''
        })
      }
    })

    console.log('✅ Successfully created trip items for trip', tripId)
  } catch (error) {
    console.error('❌ Error creating trip items for trip:', tripId, error)
  }
} 