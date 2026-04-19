import { Model, Q } from '@nozbe/watermelondb'
import database, { initializeDatabase } from './init'
import Trip from './model/Trip'
import TripItem from './model/TripItem'
import User from './model/User'
import Flight from './model/Flight'
import ActivityItem from './model/ActivityItem'

// Default user ID if none is provided
const CSV_USER_ID = 'csv-user'
const CSV_USER_PROFILE = {
  id: CSV_USER_ID,
  email: 'csv+user@tripcare.dev',
  name: 'CSV Seed User',
  home_city_id: 'csv-city',
  home_city_name: 'CSV City',
}

// Variable to store the current user ID to be used for seeding
let CURRENT_SEED_USER_ID = CSV_USER_ID

const ensureCsvUserExists = async () => {
  const usersCollection = database.get<User>('users')
  const existing = await usersCollection.query().fetch()

  const matching = existing.find(u => u.id === CURRENT_SEED_USER_ID)
  if (matching) {
    // User already exists, no need to update
    console.log(`✅ Using existing user for seeding: ${matching.email} (ID: ${matching.id})`)
    return matching
  }

  // Only create CSV user if using the default CSV_USER_ID
  if (CURRENT_SEED_USER_ID === CSV_USER_ID) {
    return await database.write(async () => {
      return await usersCollection.create(u => {
        u._raw.id = CSV_USER_PROFILE.id // force id to match child rows
        u.email = CSV_USER_PROFILE.email
        u.name = CSV_USER_PROFILE.name
        u.homeCityId = CSV_USER_PROFILE.home_city_id
        u.homeCityName = CSV_USER_PROFILE.home_city_name
        u.updatedAtUtc = new Date()
      })
    })
  }
  
  // If we're here, it means a specific user ID was provided but doesn't exist
  throw new Error(`User with ID ${CURRENT_SEED_USER_ID} not found. Please log in first.`)
}

// Complete CSV data for trips
const tripsData = [
  {
    identifier: '83826224',
    name: 'Mexico City Trip',
    description: 'An exciting journey to explore the vibrant culture and rich history of Mexico City. This trip included visits to ancient Aztec ruins, sampling authentic Mexican cuisine, and experiencing the colorful local markets. The city\'s colonial architecture and modern art scene provided a perfect blend of old and new.',
    startTime: '2015-07-03 07:00:00',
    endTime: '2015-07-06 17:40:00',
    destination: 'Mexico City, MX',
    startTimeUTC: '2015-07-03 11:00:00',
    endTimeUTC: '2015-07-06 21:40:00',
    createdAtUTC: '2015-06-26 20:42:11',
    updatedAtUTC: '2015-06-26 20:42:15'
  },
  {
    identifier: '200544502',
    name: 'Punta Cana',
    description: 'A quick visit to the beautiful beaches of Punta Cana.',
    startTime: '2017-03-24 11:40:49',
    endTime: '2017-03-24 11:40:49',
    destination: '',
    startTimeUTC: '2017-03-24 11:40:49',
    endTimeUTC: '2017-03-24 11:40:49',
    createdAtUTC: '2017-03-24 11:40:49',
    updatedAtUTC: '2024-04-26 02:05:03'
  },
  {
    identifier: '200567553',
    name: 'Toronto',
    description: 'A day trip to explore the diverse neighborhoods and cultural attractions of Toronto. The city offered a perfect mix of urban sophistication and natural beauty, with highlights including the iconic CN Tower, the historic Distillery District, and the scenic waterfront along Lake Ontario.',
    startTime: '2017-03-25 00:00:00',
    endTime: '2017-03-25 00:00:00',
    destination: 'Toronto, CA',
    startTimeUTC: '2017-03-25 04:00:00',
    endTimeUTC: '2017-03-25 04:00:00',
    createdAtUTC: '2017-03-24 13:56:54',
    updatedAtUTC: '2019-10-22 15:47:38'
  },
  {
    identifier: '238687126',
    name: 'Delhi',
    description: 'An immersive journey through the heart of India\'s capital city. Delhi offered a fascinating blend of ancient history and modern development, with visits to iconic landmarks like the Red Fort, Humayun\'s Tomb, and the bustling Chandni Chowk market. The trip also included exploring the spiritual side of the city through visits to various temples and experiencing the rich culinary traditions that make Delhi a food lover\'s paradise.',
    startTime: '2017-09-13 19:00:00',
    endTime: '2017-09-25 13:40:00',
    destination: 'Delhi, IN',
    startTimeUTC: '2017-09-13 23:00:00',
    endTimeUTC: '2017-09-25 17:40:00',
    createdAtUTC: '2017-09-18 14:40:56',
    updatedAtUTC: '2017-09-24 19:02:29'
  },
  {
    identifier: '263947103',
    name: 'Delhi',
    description: 'An extended stay in Delhi to fully experience the city\'s diverse culture and heritage.',
    startTime: '2018-01-21 18:40:00',
    endTime: '2018-03-10 14:29:00',
    destination: 'Delhi, IN',
    startTimeUTC: '2018-01-21 23:40:00',
    endTimeUTC: '2018-03-10 19:29:00',
    createdAtUTC: '2018-01-20 17:31:19',
    updatedAtUTC: '2018-03-10 13:30:17'
  },
  {
    identifier: '283979531',
    name: 'Bahamas',
    description: 'A tropical paradise getaway to the beautiful Bahamas. This trip featured pristine white sand beaches, crystal clear turquoise waters, and vibrant coral reefs perfect for snorkeling and diving. The island\'s laid-back atmosphere and warm hospitality made it an ideal destination for relaxation and adventure. Highlights included exploring the colorful streets of Nassau, sampling fresh seafood, and taking boat trips to nearby islands.',
    startTime: '2018-04-25 09:15:00',
    endTime: '2018-04-30 16:45:00',
    destination: 'Nassau, BS',
    startTimeUTC: '2018-04-25 13:15:00',
    endTimeUTC: '2018-04-30 20:45:00',
    createdAtUTC: '2018-04-17 15:44:17',
    updatedAtUTC: '2019-10-22 15:47:38'
  },
  {
    identifier: '341198850',
    name: 'Orlando',
    description: 'A magical family vacation to the theme park capital of the world. Orlando offered endless entertainment with visits to Walt Disney World, Universal Studios, and other world-class attractions.',
    startTime: '2019-10-23 09:45:00',
    endTime: '2019-10-30 16:36:00',
    destination: 'Orlando, FL',
    startTimeUTC: '2019-10-23 13:45:00',
    endTimeUTC: '2019-10-30 20:36:00',
    createdAtUTC: '2019-10-22 15:52:33',
    updatedAtUTC: '2019-10-22 15:54:36'
  },
  {
    identifier: '341216737',
    name: 'Merritt Island',
    description: 'A brief visit to Merritt Island to explore the Kennedy Space Center and learn about space exploration history.',
    startTime: '2019-10-27 08:00:00',
    endTime: '2019-10-27 09:00:00',
    destination: 'Merritt Island, FL',
    startTimeUTC: '2019-10-27 12:00:00',
    endTimeUTC: '2019-10-27 13:00:00',
    createdAtUTC: '2019-10-22 19:01:04',
    updatedAtUTC: '2019-10-22 19:18:33'
  },
  {
    identifier: '358845099',
    name: 'Rv East coast 2021',
    description: 'An epic RV adventure along the scenic East Coast of the United States. This road trip covered multiple states, offering diverse landscapes from the rocky shores of Maine to the sandy beaches of Florida. The journey included stops at historic sites, national parks, and charming coastal towns, providing a unique perspective on American history and natural beauty.',
    startTime: '2021-08-05 16:15:58',
    endTime: '2021-08-05 16:15:58',
    destination: '',
    startTimeUTC: '2021-08-05 16:15:58',
    endTimeUTC: '2021-08-05 16:15:58',
    createdAtUTC: '2021-08-05 16:15:58',
    updatedAtUTC: '2024-04-26 02:05:03'
  },
  {
    identifier: '375915356',
    name: 'Patna',
    description: 'A short trip to Patna, the capital city of Bihar, India.',
    startTime: '2023-02-20 15:50:00',
    endTime: '2023-02-20 17:55:00',
    destination: 'Patna, IN',
    startTimeUTC: '2023-02-20 10:50:00',
    endTimeUTC: '2023-02-20 12:25:00',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-09-25 00:24:35'
  },
  {
    identifier: '375915365',
    name: 'Hyderabad',
    description: 'A visit to Hyderabad, Pakistan to explore the city\'s rich cultural heritage and historical landmarks.',
    startTime: '2023-02-15 06:20:00',
    endTime: '2023-02-15 05:20:00',
    destination: 'Hyderabad, PK',
    startTimeUTC: '2023-02-15 00:50:00',
    endTimeUTC: '2023-02-15 00:20:00',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-02-13 16:18:04'
  },
  {
    identifier: '375915381',
    name: 'Delhi',
    description: 'Another extended stay in Delhi, allowing for deeper exploration of the city\'s hidden gems and local experiences.',
    startTime: '2023-01-23 19:25:00',
    endTime: '2023-03-26 06:45:00',
    destination: 'Delhi, IN',
    startTimeUTC: '2023-01-24 00:25:00',
    endTimeUTC: '2023-03-26 10:45:00',
    createdAtUTC: '2023-01-18 02:08:01',
    updatedAtUTC: '2023-09-25 00:24:35'
  },
  {
    identifier: '375915391',
    name: 'Delhi',
    description: 'A business trip to Delhi with opportunities to experience the city\'s modern business district and traditional markets.',
    startTime: '2023-02-07 19:25:00',
    endTime: '2023-03-05 05:45:00',
    destination: 'Delhi, IN',
    startTimeUTC: '2023-02-08 00:25:00',
    endTimeUTC: '2023-03-05 10:45:00',
    createdAtUTC: '2023-01-18 02:08:30',
    updatedAtUTC: '2023-03-03 22:13:36'
  },
  {
    identifier: '375915548',
    name: 'Chandigarh',
    description: 'A brief visit to Chandigarh, the planned city designed by Le Corbusier, known for its modernist architecture and beautiful gardens.',
    startTime: '2023-02-23 13:50:00',
    endTime: '2023-02-23 15:45:00',
    destination: 'Chandigarh, IN',
    startTimeUTC: '2023-02-23 08:20:00',
    endTimeUTC: '2023-02-23 10:15:00',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-09-25 00:24:35'
  },
  {
    identifier: '380810554',
    name: 'Chandler',
    description: 'A weekend getaway to Chandler, Arizona to experience the desert landscape and local southwestern culture.',
    startTime: '2023-05-22 16:00:00',
    endTime: '2023-05-25 12:00:00',
    destination: 'Chandler, AZ',
    startTimeUTC: '2023-05-22 23:00:00',
    endTimeUTC: '2023-05-25 19:00:00',
    createdAtUTC: '2023-05-22 12:12:30',
    updatedAtUTC: '2023-05-22 12:12:35'
  },
  {
    identifier: '380810555',
    name: 'Phoenix',
    description: 'An extended trip to Phoenix, Arizona to explore the vibrant city life and surrounding natural attractions. This visit included hiking in the nearby mountains, exploring the Phoenix Art Museum, and enjoying the city\'s renowned culinary scene. The warm desert climate and stunning sunsets provided the perfect backdrop for outdoor activities and cultural experiences.',
    startTime: '2023-05-22 09:20:00',
    endTime: '2023-05-26 05:48:00',
    destination: 'Phoenix, AZ',
    startTimeUTC: '2023-05-22 13:20:00',
    endTimeUTC: '2023-05-26 09:48:00',
    createdAtUTC: '2023-05-22 12:12:36',
    updatedAtUTC: '2023-05-22 12:15:39'
  },
  {
    identifier: '385584988',
    name: 'Charleston',
    description: 'A charming visit to Charleston, South Carolina to experience the city\'s rich history, beautiful architecture, and southern hospitality.',
    startTime: '2023-10-03 11:25:00',
    endTime: '2023-10-05 20:34:00',
    destination: 'Charleston, SC',
    startTimeUTC: '2023-10-03 15:25:00',
    endTimeUTC: '2023-10-06 00:34:00',
    createdAtUTC: '2023-09-25 00:23:18',
    updatedAtUTC: '2023-09-25 00:27:18'
  },
  {
    identifier: '385584998',
    name: 'Los Angeles',
    description: 'A fantastic trip to Los Angeles, California to explore the entertainment capital of the world. This visit included touring famous Hollywood landmarks, visiting the Getty Center for art and architecture, and experiencing the diverse neighborhoods from Venice Beach to downtown LA. The city\'s perfect weather and endless entertainment options made every day an adventure.',
    startTime: '2023-09-25 16:00:00',
    endTime: '2023-09-28 06:01:00',
    destination: 'Los Angeles, CA',
    startTimeUTC: '2023-09-25 22:30:00',
    endTimeUTC: '2023-09-28 10:01:00',
    createdAtUTC: '2023-09-25 00:23:33',
    updatedAtUTC: '2024-04-26 02:05:03'
  },
  {
    identifier: '385585009',
    name: 'Las Vegas',
    description: 'An exciting trip to Las Vegas, Nevada to experience the city\'s vibrant nightlife, world-class entertainment, and unique desert surroundings.',
    startTime: '2023-10-17 16:00:00',
    endTime: '2023-10-21 23:30:00',
    destination: 'Las Vegas, NV',
    startTimeUTC: '2023-10-17 23:00:00',
    endTimeUTC: '2023-10-22 03:30:00',
    createdAtUTC: '2023-09-25 00:24:14',
    updatedAtUTC: '2023-09-25 00:27:19'
  },
  {
    identifier: '385585022',
    name: 'Munich',
    description: 'An extended stay in Munich, Germany to fully immerse in Bavarian culture and European history. This trip covered the famous Oktoberfest celebrations, visits to historic sites like the Marienplatz and Nymphenburg Palace, and exploration of the surrounding Alpine region. The experience included sampling traditional German cuisine, visiting world-class museums, and enjoying the city\'s beautiful parks and gardens.',
    startTime: '2023-11-13 12:15:00',
    endTime: '2024-02-11 05:30:00',
    destination: 'Munich, DE',
    startTimeUTC: '2023-11-13 11:15:00',
    endTimeUTC: '2024-02-11 10:30:00',
    createdAtUTC: '2023-09-25 00:24:43',
    updatedAtUTC: '2024-02-10 12:58:56'
  },
  {
    identifier: '386759615',
    name: 'Philadelphia',
    description: 'A weekend trip to Philadelphia, Pennsylvania to explore the city\'s rich American history and vibrant culture.',
    startTime: '2023-10-24 16:00:00',
    endTime: '2023-10-26 17:55:00',
    destination: 'Philadelphia, PA',
    startTimeUTC: '2023-10-24 20:00:00',
    endTimeUTC: '2023-10-26 21:55:00',
    createdAtUTC: '2023-10-24 15:06:03',
    updatedAtUTC: '2023-10-24 18:24:54'
  },
  {
    identifier: '388546938',
    name: 'Pittsburgh',
    description: 'A business trip to Pittsburgh, Pennsylvania to explore the city\'s industrial heritage and modern innovation.',
    startTime: '2023-12-12 15:05:00',
    endTime: '2023-12-13 18:10:00',
    destination: 'Pittsburgh, PA',
    startTimeUTC: '2023-12-12 20:05:00',
    endTimeUTC: '2023-12-13 23:10:00',
    createdAtUTC: '2023-12-12 03:06:20',
    updatedAtUTC: '2023-12-12 03:21:53'
  },
  {
    identifier: '388546946',
    name: 'Coraopolis',
    description: 'A quick visit to Coraopolis, Pennsylvania to explore the small town charm and local community.',
    startTime: '2023-12-12 16:00:00',
    endTime: '2023-12-13 12:00:00',
    destination: 'Coraopolis, PA',
    startTimeUTC: '2023-12-12 21:00:00',
    endTimeUTC: '2023-12-13 17:00:00',
    createdAtUTC: '2023-12-12 03:06:43',
    updatedAtUTC: '2023-12-12 03:21:54'
  },
  {
    identifier: '388564259',
    name: 'Coraopolis',
    description: 'Another visit to Coraopolis to further explore the area and connect with the local community.',
    startTime: '2023-12-12 16:00:00',
    endTime: '2023-12-13 12:00:00',
    destination: 'Coraopolis, PA',
    startTimeUTC: '2023-12-12 21:00:00',
    endTimeUTC: '2023-12-13 17:00:00',
    createdAtUTC: '2023-12-12 16:04:04',
    updatedAtUTC: '2023-12-12 16:04:13'
  },
  {
    identifier: '391103488',
    name: 'Toronto',
    description: 'A return visit to Toronto to experience the city in winter and explore seasonal attractions.',
    startTime: '2024-02-18 10:50:00',
    endTime: '2024-02-19 20:15:00',
    destination: 'Toronto, CA',
    startTimeUTC: '2024-02-18 05:20:00',
    endTimeUTC: '2024-02-20 01:15:00',
    createdAtUTC: '2024-02-18 00:15:01',
    updatedAtUTC: '2024-02-18 00:15:23'
  },
  {
    identifier: '394460196',
    name: 'San Francisco',
    description: 'An amazing trip to San Francisco, California to explore the iconic Golden Gate Bridge, Alcatraz Island, and the vibrant neighborhoods of this beautiful coastal city. The trip included riding the historic cable cars, visiting Fisherman\'s Wharf, and exploring the diverse culinary scene that makes San Francisco a food lover\'s paradise.',
    startTime: '2024-05-08 06:30:00',
    endTime: '2024-05-12 06:55:00',
    destination: 'San Francisco, CA',
    startTimeUTC: '2024-05-08 10:30:00',
    endTimeUTC: '2024-05-12 10:55:00',
    createdAtUTC: '2024-05-10 11:32:40',
    updatedAtUTC: '2024-05-10 11:32:40'
  },
  {
    identifier: '395129212',
    name: 'Phoenix',
    description: 'Another visit to Phoenix to explore different areas of the city and enjoy the summer activities.',
    startTime: '2024-06-10 16:00:00',
    endTime: '2024-06-14 08:50:00',
    destination: 'Phoenix, AZ',
    startTimeUTC: '2024-06-10 23:00:00',
    endTimeUTC: '2024-06-14 12:50:00',
    createdAtUTC: '2024-05-28 13:39:39',
    updatedAtUTC: '2024-06-13 22:47:37'
  },
  {
    identifier: '396919699',
    name: 'Cleveland',
    description: 'A summer trip to Cleveland, Ohio to explore the city\'s cultural institutions and enjoy the beautiful Lake Erie waterfront.',
    startTime: '2024-07-15 16:00:00',
    endTime: '2024-07-19 12:00:00',
    destination: 'Cleveland, OH',
    startTimeUTC: '2024-07-15 20:00:00',
    endTimeUTC: '2024-07-19 16:00:00',
    createdAtUTC: '2024-07-15 03:31:48',
    updatedAtUTC: '2024-07-15 03:32:01'
  },
  {
    identifier: '397880143',
    name: 'San Francisco',
    description: 'A return visit to San Francisco to explore different neighborhoods and experience the city during the summer months.',
    startTime: '2024-08-07 12:55:00',
    endTime: '2024-08-09 19:31:00',
    destination: 'San Francisco, CA',
    startTimeUTC: '2024-08-07 16:55:00',
    endTimeUTC: '2024-08-09 23:31:00',
    createdAtUTC: '2024-08-07 15:49:20',
    updatedAtUTC: '2024-08-09 15:35:25'
  },
  {
    identifier: '398690816',
    name: 'Vancouver',
    description: 'A quick trip to Vancouver, Canada to experience the city\'s stunning natural beauty and vibrant urban culture.',
    startTime: '2024-08-28 19:15:00',
    endTime: '2024-08-29 05:28:00',
    destination: 'Vancouver, CA',
    startTimeUTC: '2024-08-28 23:15:00',
    endTimeUTC: '2024-08-29 09:28:00',
    createdAtUTC: '2024-08-27 22:09:17',
    updatedAtUTC: '2024-08-28 10:28:32'
  },
  {
    identifier: '402823107',
    name: 'Disney World!',
    description: 'A magical Christmas vacation to Disney World in Orlando, Florida! This family trip was filled with holiday cheer, magical moments, and unforgettable experiences. We visited all four theme parks - Magic Kingdom, Epcot, Hollywood Studios, and Animal Kingdom - each decorated beautifully for the holiday season. The trip included special Christmas events, character meet-and-greets, and spectacular fireworks displays that made it a truly enchanting holiday experience.',
    startTime: '2024-12-19 08:20:00',
    endTime: '2024-12-26 14:28:00',
    destination: 'Orlando, FL',
    startTimeUTC: '2024-12-19 13:20:00',
    endTimeUTC: '2024-12-26 19:28:00',
    createdAtUTC: '2024-12-17 03:24:52',
    updatedAtUTC: '2024-12-17 03:25:08'
  }
]

// Complete CSV data for flights
const flightsData = [
  {
    tripIdentifier: '83826224',
    itemIdentifier: '280282441',
    airline: 'US',
    flightNumber: '1259',
    departureAirport: 'YYZ',
    arrivalAirport: 'DFW',
    departureTimeLocal: '2015-07-03 07:00:00',
    departureTimeUTC: '2015-07-03 11:00:00',
    arrivalTimeLocal: '2015-07-03 09:21:00',
    arrivalTimeUTC: '2015-07-03 14:21:00',
    confirmationNumber: 'CGTD8V',
    note: '',
    createdAtUTC: '2015-06-26 20:42:11',
    updatedAtUTC: '2015-06-26 20:42:11'
  },
  {
    tripIdentifier: '83826224',
    itemIdentifier: '280282443',
    airline: 'US',
    flightNumber: '393',
    departureAirport: 'DFW',
    arrivalAirport: 'MEX',
    departureTimeLocal: '2015-07-03 10:50:00',
    departureTimeUTC: '2015-07-03 15:50:00',
    arrivalTimeLocal: '2015-07-03 13:29:00',
    arrivalTimeUTC: '2015-07-03 18:29:00',
    confirmationNumber: 'CGTD8V',
    note: '',
    createdAtUTC: '2015-06-26 20:42:12',
    updatedAtUTC: '2015-06-26 20:42:12'
  },
  {
    tripIdentifier: '83826224',
    itemIdentifier: '280282449',
    airline: 'US',
    flightNumber: '1374',
    departureAirport: 'MEX',
    arrivalAirport: 'DFW',
    departureTimeLocal: '2015-07-06 07:40:00',
    departureTimeUTC: '2015-07-06 12:40:00',
    arrivalTimeLocal: '2015-07-06 10:33:00',
    arrivalTimeUTC: '2015-07-06 15:33:00',
    confirmationNumber: 'CGTD8V',
    note: '',
    createdAtUTC: '2015-06-26 20:42:12',
    updatedAtUTC: '2015-06-26 20:42:12'
  },
  {
    tripIdentifier: '83826224',
    itemIdentifier: '280282451',
    airline: 'US',
    flightNumber: '2267',
    departureAirport: 'DFW',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2015-07-06 13:35:00',
    departureTimeUTC: '2015-07-06 18:35:00',
    arrivalTimeLocal: '2015-07-06 17:40:00',
    arrivalTimeUTC: '2015-07-06 21:40:00',
    confirmationNumber: 'CGTD8V',
    note: '',
    createdAtUTC: '2015-06-26 20:42:12',
    updatedAtUTC: '2015-06-26 20:42:12'
  },
  {
    tripIdentifier: '238687126',
    itemIdentifier: '758759748',
    airline: '9W',
    flightNumber: '233',
    departureAirport: 'YYZ',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2017-09-13 19:00:00',
    departureTimeUTC: '2017-09-13 23:00:00',
    arrivalTimeLocal: '2017-09-14 23:15:00',
    arrivalTimeUTC: '2017-09-14 17:45:00',
    confirmationNumber: 'XYXKMB',
    note: '',
    createdAtUTC: '2017-09-18 14:40:56',
    updatedAtUTC: '2017-09-18 14:40:56'
  },
  {
    tripIdentifier: '238687126',
    itemIdentifier: '758759753',
    airline: '9W',
    flightNumber: '234',
    departureAirport: 'DEL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2017-09-25 02:35:00',
    departureTimeUTC: '2017-09-24 21:05:00',
    arrivalTimeLocal: '2017-09-25 13:40:00',
    arrivalTimeUTC: '2017-09-25 17:40:00',
    confirmationNumber: 'XYXKMB',
    note: '',
    createdAtUTC: '2017-09-18 14:40:56',
    updatedAtUTC: '2017-09-18 14:40:56'
  },
  {
    tripIdentifier: '263947103',
    itemIdentifier: '832885907',
    airline: '9W',
    flightNumber: '233',
    departureAirport: 'YYZ',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2018-01-21 18:40:00',
    departureTimeUTC: '2018-01-21 23:40:00',
    arrivalTimeLocal: '2018-01-22 23:55:00',
    arrivalTimeUTC: '2018-01-22 18:25:00',
    confirmationNumber: 'MKBLOZ',
    note: '',
    createdAtUTC: '2018-01-20 17:31:19',
    updatedAtUTC: '2018-01-20 17:31:19'
  },
  {
    tripIdentifier: '263947103',
    itemIdentifier: '832885909',
    airline: '9W',
    flightNumber: '2794',
    departureAirport: 'ATQ',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2018-03-09 21:30:00',
    departureTimeUTC: '2018-03-09 16:00:00',
    arrivalTimeLocal: '2018-03-09 23:05:00',
    arrivalTimeUTC: '2018-03-09 17:35:00',
    confirmationNumber: 'MKBLOZ',
    note: '',
    createdAtUTC: '2018-01-20 17:31:19',
    updatedAtUTC: '2018-01-20 17:31:19'
  },
  {
    tripIdentifier: '263947103',
    itemIdentifier: '832885910',
    airline: '9W',
    flightNumber: '234',
    departureAirport: 'DEL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2018-03-10 02:40:00',
    departureTimeUTC: '2018-03-09 21:10:00',
    arrivalTimeLocal: '2018-03-10 14:29:00',
    arrivalTimeUTC: '2018-03-10 19:29:00',
    confirmationNumber: 'MKBLOZ',
    note: '',
    createdAtUTC: '2018-01-20 17:31:19',
    updatedAtUTC: '2018-01-20 17:31:19'
  },
  {
    tripIdentifier: '283979531',
    itemIdentifier: '893965713',
    airline: 'WS',
    flightNumber: '2754',
    departureAirport: 'YYZ',
    arrivalAirport: 'NAS',
    departureTimeLocal: '2018-04-25 09:15:00',
    departureTimeUTC: '2018-04-25 13:15:00',
    arrivalTimeLocal: '2018-04-25 12:31:00',
    arrivalTimeUTC: '2018-04-25 16:31:00',
    confirmationNumber: 'KHOWKW',
    note: '',
    createdAtUTC: '2018-04-17 15:45:23',
    updatedAtUTC: '2018-04-23 05:47:06'
  },
  {
    tripIdentifier: '283979531',
    itemIdentifier: '893965714',
    airline: 'WS',
    flightNumber: '2755',
    departureAirport: 'NAS',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2018-04-30 13:25:00',
    departureTimeUTC: '2018-04-30 17:25:00',
    arrivalTimeLocal: '2018-04-30 16:45:00',
    arrivalTimeUTC: '2018-04-30 20:45:00',
    confirmationNumber: 'KHOWKW',
    note: '',
    createdAtUTC: '2018-04-17 15:45:23',
    updatedAtUTC: '2018-04-28 10:00:34'
  },
  {
    tripIdentifier: '341198850',
    itemIdentifier: '1061788155',
    airline: 'WS',
    flightNumber: '1228',
    departureAirport: 'YYZ',
    arrivalAirport: 'MCO',
    departureTimeLocal: '2019-10-23 09:45:00',
    departureTimeUTC: '2019-10-23 13:45:00',
    arrivalTimeLocal: '2019-10-23 12:32:00',
    arrivalTimeUTC: '2019-10-23 16:32:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2019-10-22 15:52:34',
    updatedAtUTC: '2019-10-22 15:52:34'
  },
  {
    tripIdentifier: '341198850',
    itemIdentifier: '1061788156',
    airline: 'WS',
    flightNumber: '1229',
    departureAirport: 'MCO',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2019-10-30 13:50:00',
    departureTimeUTC: '2019-10-30 17:50:00',
    arrivalTimeLocal: '2019-10-30 16:36:00',
    arrivalTimeUTC: '2019-10-30 20:36:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2019-10-22 15:52:34',
    updatedAtUTC: '2019-10-22 15:52:34'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048231',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048232',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048233',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048234',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048235',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915356',
    itemIdentifier: '1154048236',
    airline: '6E',
    flightNumber: '6223',
    departureAirport: 'HDD',
    arrivalAirport: 'PAT',
    departureTimeLocal: '2023-02-20 15:50:00',
    departureTimeUTC: '2023-02-20 10:50:00',
    arrivalTimeLocal: '2023-02-20 17:55:00',
    arrivalTimeUTC: '2023-02-20 12:25:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:06:53',
    updatedAtUTC: '2023-02-19 10:23:33'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048271',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: 'bkje4f',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-02-13 16:18:04'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048272',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-01-18 02:07:14'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048273',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-01-18 02:07:14'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048274',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-01-18 02:07:14'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048275',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-01-18 02:07:14'
  },
  {
    tripIdentifier: '375915365',
    itemIdentifier: '1154048276',
    airline: '6E',
    flightNumber: '867',
    departureAirport: 'IXC',
    arrivalAirport: 'HDD',
    departureTimeLocal: '2023-02-15 06:20:00',
    departureTimeUTC: '2023-02-15 00:50:00',
    arrivalTimeLocal: '2023-02-15 05:20:00',
    arrivalTimeUTC: '2023-02-15 00:20:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:07:14',
    updatedAtUTC: '2023-01-18 02:07:14'
  },
  {
    tripIdentifier: '375915381',
    itemIdentifier: '1154048325',
    airline: 'AC',
    flightNumber: '42',
    departureAirport: 'YYZ',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2023-01-23 19:25:00',
    departureTimeUTC: '2023-01-24 00:25:00',
    arrivalTimeLocal: '2023-01-24 21:15:00',
    arrivalTimeUTC: '2023-01-24 15:45:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:08:01',
    updatedAtUTC: '2023-01-18 02:08:01'
  },
  {
    tripIdentifier: '375915381',
    itemIdentifier: '1154048326',
    airline: 'AC',
    flightNumber: '43',
    departureAirport: 'DEL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-03-25 23:15:00',
    departureTimeUTC: '2023-03-25 17:45:00',
    arrivalTimeLocal: '2023-03-26 06:45:00',
    arrivalTimeUTC: '2023-03-26 10:45:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:08:01',
    updatedAtUTC: '2023-01-18 02:08:01'
  },
  {
    tripIdentifier: '375915391',
    itemIdentifier: '1154048369',
    airline: 'AC',
    flightNumber: '42',
    departureAirport: 'YYZ',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2023-02-07 19:25:00',
    departureTimeUTC: '2023-02-08 00:25:00',
    arrivalTimeLocal: '2023-02-08 21:15:00',
    arrivalTimeUTC: '2023-02-08 15:45:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:08:30',
    updatedAtUTC: '2023-01-18 02:08:30'
  },
  {
    tripIdentifier: '375915391',
    itemIdentifier: '1154048370',
    airline: 'AC',
    flightNumber: '43',
    departureAirport: 'DEL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-03-04 23:15:00',
    departureTimeUTC: '2023-03-04 17:45:00',
    arrivalTimeLocal: '2023-03-05 05:45:00',
    arrivalTimeUTC: '2023-03-05 10:45:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:08:30',
    updatedAtUTC: '2023-02-15 14:49:01'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048805',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048806',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048807',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048808',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048809',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '375915548',
    itemIdentifier: '1154048810',
    airline: '6E',
    flightNumber: '6485',
    departureAirport: 'PAT',
    arrivalAirport: 'IXC',
    departureTimeLocal: '2023-02-23 13:50:00',
    departureTimeUTC: '2023-02-23 08:20:00',
    arrivalTimeLocal: '2023-02-23 15:45:00',
    arrivalTimeUTC: '2023-02-23 10:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-01-18 02:14:56',
    updatedAtUTC: '2023-01-18 02:14:56'
  },
  {
    tripIdentifier: '380810555',
    itemIdentifier: '1167370097',
    airline: 'AC',
    flightNumber: '1721',
    departureAirport: 'YYZ',
    arrivalAirport: 'PHX',
    departureTimeLocal: '2023-05-22 09:20:00',
    departureTimeUTC: '2023-05-22 13:20:00',
    arrivalTimeLocal: '2023-05-22 11:08:00',
    arrivalTimeUTC: '2023-05-22 18:08:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-05-22 12:12:36',
    updatedAtUTC: '2023-05-22 12:12:36'
  },
  {
    tripIdentifier: '380810555',
    itemIdentifier: '1167370099',
    airline: 'DL',
    flightNumber: '5030',
    departureAirport: 'DTW',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-05-25 10:02:00',
    departureTimeUTC: '2023-05-25 14:02:00',
    arrivalTimeLocal: '2023-05-25 11:15:00',
    arrivalTimeUTC: '2023-05-25 15:15:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-05-22 12:12:36',
    updatedAtUTC: '2023-05-22 12:12:36'
  },
  {
    tripIdentifier: '380810555',
    itemIdentifier: '1167370098',
    airline: 'DL',
    flightNumber: '1123',
    departureAirport: 'PHX',
    arrivalAirport: 'DTW',
    departureTimeLocal: '2023-05-25 23:04:00',
    departureTimeUTC: '2023-05-26 06:04:00',
    arrivalTimeLocal: '2023-05-26 05:48:00',
    arrivalTimeUTC: '2023-05-26 09:48:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-05-22 12:12:36',
    updatedAtUTC: '2023-05-22 12:12:36'
  },
  {
    tripIdentifier: '385584988',
    itemIdentifier: '1180130223',
    airline: 'DL',
    flightNumber: '1183',
    departureAirport: 'YYZ',
    arrivalAirport: 'ATL',
    departureTimeLocal: '2023-10-03 11:25:00',
    departureTimeUTC: '2023-10-03 15:25:00',
    arrivalTimeLocal: '2023-10-03 13:34:00',
    arrivalTimeUTC: '2023-10-03 17:34:00',
    confirmationNumber: 'HCIH2S',
    note: '',
    createdAtUTC: '2023-09-25 00:23:18',
    updatedAtUTC: '2023-09-25 00:23:18'
  },
  {
    tripIdentifier: '385584988',
    itemIdentifier: '1180130224',
    airline: 'DL',
    flightNumber: '2229',
    departureAirport: 'ATL',
    arrivalAirport: 'CHS',
    departureTimeLocal: '2023-10-03 14:56:00',
    departureTimeUTC: '2023-10-03 18:56:00',
    arrivalTimeLocal: '2023-10-03 16:05:00',
    arrivalTimeUTC: '2023-10-03 20:05:00',
    confirmationNumber: 'HCIH2S',
    note: '',
    createdAtUTC: '2023-09-25 00:23:18',
    updatedAtUTC: '2023-09-25 00:23:18'
  },
  {
    tripIdentifier: '385584988',
    itemIdentifier: '1180130225',
    airline: 'DL',
    flightNumber: '4975',
    departureAirport: 'CHS',
    arrivalAirport: 'LGA',
    departureTimeLocal: '2023-10-05 14:24:00',
    departureTimeUTC: '2023-10-05 18:24:00',
    arrivalTimeLocal: '2023-10-05 16:26:00',
    arrivalTimeUTC: '2023-10-05 20:26:00',
    confirmationNumber: 'HCIH2S',
    note: '',
    createdAtUTC: '2023-09-25 00:23:18',
    updatedAtUTC: '2023-09-25 00:23:18'
  },
  {
    tripIdentifier: '385584988',
    itemIdentifier: '1180130226',
    airline: 'DL',
    flightNumber: '5293',
    departureAirport: 'LGA',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-10-05 18:44:00',
    departureTimeUTC: '2023-10-05 22:44:00',
    arrivalTimeLocal: '2023-10-05 20:34:00',
    arrivalTimeUTC: '2023-10-06 00:34:00',
    confirmationNumber: 'HCIH2S',
    note: '',
    createdAtUTC: '2023-09-25 00:23:18',
    updatedAtUTC: '2023-09-25 00:23:18'
  },
  {
    tripIdentifier: '385584998',
    itemIdentifier: '1180130236',
    airline: 'AC',
    flightNumber: '793',
    departureAirport: 'YYZ',
    arrivalAirport: 'LAX',
    departureTimeLocal: '2023-09-25 18:30:00',
    departureTimeUTC: '2023-09-25 22:30:00',
    arrivalTimeLocal: '2023-09-25 20:55:00',
    arrivalTimeUTC: '2023-09-26 03:55:00',
    confirmationNumber: '39EYM6',
    note: '',
    createdAtUTC: '2023-09-25 00:23:33',
    updatedAtUTC: '2023-09-25 00:23:33'
  },
  {
    tripIdentifier: '385584998',
    itemIdentifier: '1180130238',
    airline: 'AC',
    flightNumber: '794',
    departureAirport: 'LAX',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-09-27 22:20:00',
    departureTimeUTC: '2023-09-28 05:20:00',
    arrivalTimeLocal: '2023-09-28 06:01:00',
    arrivalTimeUTC: '2023-09-28 10:01:00',
    confirmationNumber: '39EYM6',
    note: '',
    createdAtUTC: '2023-09-25 00:23:33',
    updatedAtUTC: '2023-09-25 00:23:33'
  },
  {
    tripIdentifier: '385585009',
    itemIdentifier: '1180130274',
    airline: 'AC',
    flightNumber: '1705',
    departureAirport: 'YYZ',
    arrivalAirport: 'LAS',
    departureTimeLocal: '2023-10-17 20:40:00',
    departureTimeUTC: '2023-10-18 00:40:00',
    arrivalTimeLocal: '2023-10-17 22:32:00',
    arrivalTimeUTC: '2023-10-18 05:32:00',
    confirmationNumber: '2MPTCE',
    note: '',
    createdAtUTC: '2023-09-25 00:24:14',
    updatedAtUTC: '2023-09-25 00:24:14'
  },
  {
    tripIdentifier: '385585009',
    itemIdentifier: '1180130276',
    airline: 'F8',
    flightNumber: '1676',
    departureAirport: 'LAS',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-10-21 16:35:00',
    departureTimeUTC: '2023-10-21 23:35:00',
    arrivalTimeLocal: '2023-10-21 23:30:00',
    arrivalTimeUTC: '2023-10-22 03:30:00',
    confirmationNumber: 'XA65ZV',
    note: '',
    createdAtUTC: '2023-09-25 00:24:15',
    updatedAtUTC: '2023-09-25 00:24:15'
  },
  {
    tripIdentifier: '385585022',
    itemIdentifier: '1180130305',
    airline: 'AC',
    flightNumber: '9588',
    departureAirport: 'MUC',
    arrivalAirport: 'DEL',
    departureTimeLocal: '2023-11-13 12:15:00',
    departureTimeUTC: '2023-11-13 11:15:00',
    arrivalTimeLocal: '2023-11-14 00:10:00',
    arrivalTimeUTC: '2023-11-13 18:40:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-09-25 00:24:43',
    updatedAtUTC: '2023-09-25 00:24:43'
  },
  {
    tripIdentifier: '385585022',
    itemIdentifier: '1180130304',
    airline: 'AC',
    flightNumber: '836',
    departureAirport: 'YYZ',
    arrivalAirport: 'MUC',
    departureTimeLocal: '2023-11-13 20:00:00',
    departureTimeUTC: '2023-11-14 01:00:00',
    arrivalTimeLocal: '2023-11-14 09:50:00',
    arrivalTimeUTC: '2023-11-14 08:50:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-09-25 00:24:43',
    updatedAtUTC: '2023-09-25 00:24:43'
  },
  {
    tripIdentifier: '385585022',
    itemIdentifier: '1180130306',
    airline: 'AC',
    flightNumber: '43',
    departureAirport: 'DEL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-02-10 23:15:00',
    departureTimeUTC: '2024-02-10 17:45:00',
    arrivalTimeLocal: '2024-02-11 05:30:00',
    arrivalTimeUTC: '2024-02-11 10:30:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-09-25 00:24:43',
    updatedAtUTC: '2023-09-25 00:24:43'
  },
  {
    tripIdentifier: '386759615',
    itemIdentifier: '1183273969',
    airline: 'UA',
    flightNumber: '8194',
    departureAirport: 'YYZ',
    arrivalAirport: 'PHL',
    departureTimeLocal: '2023-10-24 19:15:00',
    departureTimeUTC: '2023-10-24 23:15:00',
    arrivalTimeLocal: '2023-10-24 20:43:00',
    arrivalTimeUTC: '2023-10-25 00:43:00',
    confirmationNumber: 'C54BSB',
    note: '',
    createdAtUTC: '2023-10-24 15:06:04',
    updatedAtUTC: '2023-10-24 15:06:04'
  },
  {
    tripIdentifier: '386759615',
    itemIdentifier: '1183273971',
    airline: 'AC',
    flightNumber: '8933',
    departureAirport: 'PHL',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-10-26 16:15:00',
    departureTimeUTC: '2023-10-26 20:15:00',
    arrivalTimeLocal: '2023-10-26 17:55:00',
    arrivalTimeUTC: '2023-10-26 21:55:00',
    confirmationNumber: '2JWGJD',
    note: '',
    createdAtUTC: '2023-10-24 15:06:04',
    updatedAtUTC: '2023-10-24 15:06:04'
  },
  {
    tripIdentifier: '388546938',
    itemIdentifier: '1187876957',
    airline: 'AC',
    flightNumber: '8923',
    departureAirport: 'YYZ',
    arrivalAirport: 'PIT',
    departureTimeLocal: '2023-12-12 15:05:00',
    departureTimeUTC: '2023-12-12 20:05:00',
    arrivalTimeLocal: '2023-12-12 16:19:00',
    arrivalTimeUTC: '2023-12-12 21:19:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-12-12 03:06:20',
    updatedAtUTC: '2023-12-12 03:06:20'
  },
  {
    tripIdentifier: '388546938',
    itemIdentifier: '1187876958',
    airline: 'AC',
    flightNumber: '8924',
    departureAirport: 'PIT',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2023-12-13 17:00:00',
    departureTimeUTC: '2023-12-13 22:00:00',
    arrivalTimeLocal: '2023-12-13 18:10:00',
    arrivalTimeUTC: '2023-12-13 23:10:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2023-12-12 03:06:20',
    updatedAtUTC: '2023-12-12 03:06:20'
  },
  {
    tripIdentifier: '391103488',
    itemIdentifier: '1194453244',
    airline: 'BA',
    flightNumber: '256',
    departureAirport: 'DEL',
    arrivalAirport: 'LHR',
    departureTimeLocal: '2024-02-18 10:50:00',
    departureTimeUTC: '2024-02-18 05:20:00',
    arrivalTimeLocal: '2024-02-18 15:10:00',
    arrivalTimeUTC: '2024-02-18 15:10:00',
    confirmationNumber: 'AIRBUS',
    note: '',
    createdAtUTC: '2024-02-18 00:15:01',
    updatedAtUTC: '2024-02-18 00:15:01'
  },
  {
    tripIdentifier: '391103488',
    itemIdentifier: '1194453245',
    airline: 'BA',
    flightNumber: '99',
    departureAirport: 'LHR',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-02-18 17:05:00',
    departureTimeUTC: '2024-02-18 17:05:00',
    arrivalTimeLocal: '2024-02-18 20:15:00',
    arrivalTimeUTC: '2024-02-19 01:15:00',
    confirmationNumber: 'BOEING',
    note: '',
    createdAtUTC: '2024-02-18 00:15:01',
    updatedAtUTC: '2024-02-18 00:15:01'
  },
  {
    tripIdentifier: '391103488',
    itemIdentifier: '1194453246',
    airline: 'BA',
    flightNumber: '99',
    departureAirport: 'LHR',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-02-19 17:05:00',
    departureTimeUTC: '2024-02-19 17:05:00',
    arrivalTimeLocal: '2024-02-19 20:15:00',
    arrivalTimeUTC: '2024-02-20 01:15:00',
    confirmationNumber: 'BOEING',
    note: '',
    createdAtUTC: '2024-02-18 00:15:01',
    updatedAtUTC: '2024-02-18 00:15:01'
  },
  {
    tripIdentifier: '394460196',
    itemIdentifier: '1201521118',
    airline: 'AC',
    flightNumber: '4105',
    departureAirport: 'YYZ',
    arrivalAirport: 'SFO',
    departureTimeLocal: '2024-05-08 06:30:00',
    departureTimeUTC: '2024-05-08 10:30:00',
    arrivalTimeLocal: '2024-05-08 09:24:00',
    arrivalTimeUTC: '2024-05-08 16:24:00',
    confirmationNumber: '3YONVW',
    note: '',
    createdAtUTC: '2024-04-26 02:04:57',
    updatedAtUTC: '2024-05-07 21:52:18'
  },
  {
    tripIdentifier: '394460196',
    itemIdentifier: '1201521119',
    airline: 'AC',
    flightNumber: '4067',
    departureAirport: 'SFO',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-05-11 22:47:00',
    departureTimeUTC: '2024-05-12 05:47:00',
    arrivalTimeLocal: '2024-05-12 06:55:00',
    arrivalTimeUTC: '2024-05-12 10:55:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2024-04-26 02:04:58',
    updatedAtUTC: '2024-04-26 02:04:58'
  },
  {
    tripIdentifier: '395129212',
    itemIdentifier: '1204625464',
    airline: 'AC',
    flightNumber: '1723',
    departureAirport: 'YYZ',
    arrivalAirport: 'PHX',
    departureTimeLocal: '2024-06-10 19:55:00',
    departureTimeUTC: '2024-06-10 23:55:00',
    arrivalTimeLocal: '2024-06-10 21:39:00',
    arrivalTimeUTC: '2024-06-11 04:39:00',
    confirmationNumber: '3H6H2R',
    note: '',
    createdAtUTC: '2024-05-28 13:39:39',
    updatedAtUTC: '2024-05-28 13:39:39'
  },
  {
    tripIdentifier: '395129212',
    itemIdentifier: '1204625466',
    airline: 'DL',
    flightNumber: '2148',
    departureAirport: 'PHX',
    arrivalAirport: 'DTW',
    departureTimeLocal: '2024-06-13 22:55:00',
    departureTimeUTC: '2024-06-14 05:55:00',
    arrivalTimeLocal: '2024-06-14 05:43:00',
    arrivalTimeUTC: '2024-06-14 09:43:00',
    confirmationNumber: 'H2V3QB',
    note: '',
    createdAtUTC: '2024-05-28 13:39:40',
    updatedAtUTC: '2024-05-28 13:39:40'
  },
  {
    tripIdentifier: '395129212',
    itemIdentifier: '1204625467',
    airline: 'DL',
    flightNumber: '5140',
    departureAirport: 'DTW',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-06-14 07:38:00',
    departureTimeUTC: '2024-06-14 11:38:00',
    arrivalTimeLocal: '2024-06-14 08:50:00',
    arrivalTimeUTC: '2024-06-14 12:50:00',
    confirmationNumber: 'H2V3QB',
    note: '',
    createdAtUTC: '2024-05-28 13:39:40',
    updatedAtUTC: '2024-05-28 13:39:40'
  },
  {
    tripIdentifier: '397880143',
    itemIdentifier: '1211412357',
    airline: 'AC',
    flightNumber: '741',
    departureAirport: 'YYZ',
    arrivalAirport: 'SFO',
    departureTimeLocal: '2024-08-07 12:55:00',
    departureTimeUTC: '2024-08-07 16:55:00',
    arrivalTimeLocal: '2024-08-07 15:31:00',
    arrivalTimeUTC: '2024-08-07 22:31:00',
    confirmationNumber: '32UW76',
    note: '',
    createdAtUTC: '2024-08-07 15:49:20',
    updatedAtUTC: '2024-08-07 15:49:20'
  },
  {
    tripIdentifier: '397880143',
    itemIdentifier: '1211412359',
    airline: 'AC',
    flightNumber: '740',
    departureAirport: 'SFO',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-08-09 11:40:00',
    departureTimeUTC: '2024-08-09 18:40:00',
    arrivalTimeLocal: '2024-08-09 19:31:00',
    arrivalTimeUTC: '2024-08-09 23:31:00',
    confirmationNumber: '32UW76',
    note: '',
    createdAtUTC: '2024-08-07 15:49:20',
    updatedAtUTC: '2024-08-07 15:49:20'
  },
  {
    tripIdentifier: '398690816',
    itemIdentifier: '1213412411',
    airline: 'AC',
    flightNumber: '125',
    departureAirport: 'YYZ',
    arrivalAirport: 'YVR',
    departureTimeLocal: '2024-08-28 19:15:00',
    departureTimeUTC: '2024-08-28 23:15:00',
    arrivalTimeLocal: '2024-08-28 21:23:00',
    arrivalTimeUTC: '2024-08-29 04:23:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2024-08-27 22:09:18',
    updatedAtUTC: '2024-08-27 22:09:18'
  },
  {
    tripIdentifier: '398690816',
    itemIdentifier: '1213412412',
    airline: 'AC',
    flightNumber: '186',
    departureAirport: 'YVR',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-08-28 21:55:00',
    departureTimeUTC: '2024-08-29 04:55:00',
    arrivalTimeLocal: '2024-08-29 05:28:00',
    arrivalTimeUTC: '2024-08-29 09:28:00',
    confirmationNumber: '',
    note: '',
    createdAtUTC: '2024-08-27 22:09:18',
    updatedAtUTC: '2024-08-27 22:09:18'
  },
  {
    tripIdentifier: '402823107',
    itemIdentifier: '1219845361',
    airline: 'AC',
    flightNumber: '1672',
    departureAirport: 'YYZ',
    arrivalAirport: 'MCO',
    departureTimeLocal: '2024-12-19 08:20:00',
    departureTimeUTC: '2024-12-19 13:20:00',
    arrivalTimeLocal: '2024-12-19 11:20:00',
    arrivalTimeUTC: '2024-12-19 16:20:00',
    confirmationNumber: '2ZFX5S',
    note: '',
    createdAtUTC: '2024-11-03 07:33:59',
    updatedAtUTC: '2024-11-03 07:33:59'
  },
  {
    tripIdentifier: '402823107',
    itemIdentifier: '1219845393',
    airline: 'AC',
    flightNumber: '1087',
    departureAirport: 'MCO',
    arrivalAirport: 'YYZ',
    departureTimeLocal: '2024-12-26 11:35:00',
    departureTimeUTC: '2024-12-26 16:35:00',
    arrivalTimeLocal: '2024-12-26 14:28:00',
    arrivalTimeUTC: '2024-12-26 19:28:00',
    confirmationNumber: '2ZFX5S',
    note: '',
    createdAtUTC: '2024-11-03 07:34:00',
    updatedAtUTC: '2024-11-03 07:34:00'
  }
]

export const seedFromCSV = async (userId?: string) => {
  try {
    console.log('🚀 Starting CSV data seeding...')
    
    // Set the user ID to use for seeding
    if (userId) {
      CURRENT_SEED_USER_ID = userId
      console.log(`📝 Using logged-in user ID for seeding: ${userId}`)
    } else {
      CURRENT_SEED_USER_ID = CSV_USER_ID
      console.log(`📝 Using default CSV user ID for seeding: ${CSV_USER_ID}`)
    }
    
    // Check if database is ready
    if (!database) {
      throw new Error('Database is not initialized')
    }
    
    console.log('✅ Database is ready')
    
    // Check for duplicate identifiers
    const identifiers = tripsData.map(trip => trip.identifier)
    const uniqueIdentifiers = new Set(identifiers)
    if (identifiers.length !== uniqueIdentifiers.size) {
      console.warn(`⚠️ Warning: Found ${identifiers.length - uniqueIdentifiers.size} duplicate identifiers in trips data`)
      const duplicates = identifiers.filter((id, index) => identifiers.indexOf(id) !== index)
      console.warn(`⚠️ Duplicate identifiers:`, duplicates)
    } else {
      console.log(`✅ All ${identifiers.length} trip identifiers are unique`)
    }
    
    // Check if all required tables are accessible
    try {
      await database.get('trips').query().fetch()
      await database.get('trip_items').query().fetch()
      console.log('✅ All required tables are accessible')
    } catch (tableError) {
      console.error('❌ Error accessing database tables:', tableError)
      throw new Error(`Database tables not accessible: ${tableError}`)
    }
    
    // Don't clear all data if a specific user is provided
    if (!userId) {
      // Clear existing data only when using default CSV user
      await clearAllData()
    }
    
    // Check state after clearing
    await checkDatabaseState()
    
    // Seed trips from CSV data
    const createdTrips = await seedTripsFromCSV()
    
    // Check state after seeding trips
    await checkDatabaseState()
    
    // Seed flights from CSV data
    await seedFlightsFromCSV(createdTrips)
    
    // Check final state
    await checkDatabaseState()
    
    console.log('✅ CSV data seeding completed successfully')
  } catch (error) {
    console.error('❌ Error during CSV data seeding:', error)
    throw error
  }
}

// Helper function to generate a random UUID
const generateRandomUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const seedTripsFromCSV = async () => {
  try {
    console.log('📋 Seeding trips from CSV data...')
    console.log(`📊 Total trips in CSV data: ${tripsData.length}`)

    // Ensure the CSV seed user exists before creating child rows
    await ensureCsvUserExists()
    
    const createdTrips = new Map<string, string>()
    let processedCount = 0
    let successCount = 0
    let errorCount = 0
    
    for (const tripData of tripsData) {
      processedCount++
      console.log(`🔍 Processing trip ${processedCount}/${tripsData.length}: ${tripData.name} with identifier: ${tripData.identifier}`)
      
      try {
        const trip = await database.write(async () => {
          return await database.get('trips').create((trip: any) => {
            trip.userId = CURRENT_SEED_USER_ID
            trip.name = tripData.name
            trip.description = tripData.description || ''
            trip.destination = tripData.destination || ''
            // Generate a random UUID for destination_id
            trip.destinationId = generateRandomUUID()
            trip.startTime = new Date(tripData.startTime)
            trip.endTime = new Date(tripData.endTime)
            trip.createdAtUtc = new Date(tripData.createdAtUTC)
            trip.updatedAtUtc = new Date(tripData.updatedAtUTC)
            trip.dbSyncStatus = 'synced'
            trip.dbSyncChanged = 'false'
          })
        })
        
        createdTrips.set(tripData.identifier, trip.id)
        successCount++
        console.log(`✅ Created trip: ${tripData.name} (ID: ${trip.id}, destination_id: ${(trip as any).destinationId})`)
      } catch (tripError) {
        errorCount++
        console.error(`❌ Failed to create trip ${tripData.name} (${tripData.identifier}):`, tripError)
      }
    }
    
    console.log(`📊 Seeding Summary:`)
    console.log(`  - Total trips generated: ${tripsData.length}`)
    console.log(`  - Processed: ${processedCount}`)
    console.log(`  - Successfully created: ${successCount}`)
    console.log(`  - Failed: ${errorCount}`)
    console.log(`✅ Successfully seeded ${createdTrips.size} trips from CSV`)
    console.log(`📊 Final trips map:`, Object.fromEntries(createdTrips))
    return createdTrips
  } catch (error) {
    console.error('❌ Error seeding trips from CSV:', error)
    throw error
  }
}

export const seedFlightsFromCSV = async (tripsMap: Map<string, string>) => {
  try {
    console.log('✈️ Seeding flights from CSV data...')
    console.log(`📊 Trips map size: ${tripsMap.size}`)
    console.log(`📊 Available trip identifiers:`, Array.from(tripsMap.keys()))
    console.log(`📊 Flights data count: ${flightsData.length}`)
    
    let createdFlights = 0
    
    for (const flightData of flightsData) {
      console.log(`🔍 Processing flight: ${flightData.airline} ${flightData.flightNumber} for trip: ${flightData.tripIdentifier}`)
      
      const tripId = tripsMap.get(flightData.tripIdentifier)
      if (!tripId) {
        console.warn(`⚠️ Trip not found for flight ${flightData.itemIdentifier} (tripIdentifier: ${flightData.tripIdentifier})`)
        continue
      }
      
      console.log(`✅ Found trip ID: ${tripId} for flight ${flightData.airline} ${flightData.flightNumber}`)
      
      // Create both TripItem and Flight records (separate table schema)
      await database.write(async () => {
        // Step 1: Create TripItem with generic fields only
        const tripItem = await database.get('trip_items').create((item: any) => {
          item.userId = CURRENT_SEED_USER_ID
          item.tripId = tripId
          item.type = 'flight'
          item.title = `${flightData.airline} ${flightData.flightNumber}`
          item.description = `Flight from ${flightData.departureAirport} to ${flightData.arrivalAirport}`
          item.startDate = new Date(flightData.departureTimeLocal)
          item.endDate = new Date(flightData.arrivalTimeLocal)
          item.status = 'Booked'
          item.icon = 'plane'
          item.createdAt = new Date(flightData.createdAtUTC)
          item.updatedAt = new Date(flightData.updatedAtUTC)
          item.dbSyncStatus = 'synced'
          item.dbSyncChanged = 'false'
        })
        
        // Step 2: Create Flight record with flight-specific fields
        await database.get('flights').create((flight: any) => {
          flight.userId = CURRENT_SEED_USER_ID
          flight.tripItemId = tripItem.id
          flight.airline = flightData.airline
          flight.flightNumber = flightData.flightNumber
          flight.departureAirport = flightData.departureAirport
          flight.arrivalAirport = flightData.arrivalAirport
          flight.departureTimeLocal = new Date(flightData.departureTimeLocal)
          flight.departureTimeUtc = new Date(flightData.departureTimeUTC)
          flight.arrivalTimeLocal = new Date(flightData.arrivalTimeLocal)
          flight.arrivalTimeUtc = new Date(flightData.arrivalTimeUTC)
          flight.confirmationNumber = flightData.confirmationNumber || undefined
          flight.notes = flightData.note || undefined
          flight.createdAtUtc = new Date(flightData.createdAtUTC)
          flight.updatedAtUtc = new Date(flightData.updatedAtUTC)
          flight.dbSyncStatus = 'synced'
          flight.dbSyncChanged = 'false'
        })
        
        console.log(`✅ Created TripItem and Flight records for: ${flightData.airline} ${flightData.flightNumber} (tripItemId: ${tripItem.id})`)
      })
      
      createdFlights++
    }
    
    console.log(`✅ Successfully seeded ${createdFlights} flights from CSV`)
  } catch (error) {
    console.error('❌ Error seeding flights from CSV:', error)
    throw error
  }
}

export const checkDatabaseState = async () => {
  try {
    console.log('🔍 Checking database state...')
    
    // Check trips
    const trips = await database.get('trips').query().fetch()
    console.log(`📊 Trips count: ${trips.length}`)
    for (const trip of trips) {
      console.log(`  - Trip: ${(trip as any).name} (ID: ${trip.id})`)
    }
    
    // Check trip items (includes flights and activities)
    const tripItems = await database.get('trip_items').query().fetch()
    console.log(`📊 Trip items count: ${tripItems.length}`)
    for (const item of tripItems) {
      const itemType = (item as any).type
      const itemTitle = (item as any).title
      console.log(`  - ${itemType}: ${itemTitle} (ID: ${item.id}, tripId: ${(item as any).tripId})`)
    }
    
    console.log('✅ Database state check completed')
  } catch (error) {
    console.error('❌ Error checking database state:', error)
    throw error
  }
}

/**
 * Clear all data using soft delete (markAsDeleted)
 * This allows sync to track the deletions and push them to the server
 * After sync completes, optionally call clearAllDataPermanently() to purge soft-deleted records
 */
export const clearAllData = async () => {
  try {
    console.log('🧹 Clearing existing data (preserving users)...')
    console.log('📝 Using soft delete (markAsDeleted) to track deletions for sync')
    
    const softDeleteAll = async <T extends Model>(table: string) => {
      const collection = database.get<T>(table as any)
      // Only get active records - soft-deleted ones are already deleted
      const active = await collection.query(Q.where('_status', Q.notEq('deleted'))).fetch()
      
      console.log(`   Found ${active.length} active records in ${table}`)
      
      if (active.length > 0) {
        await database.write(async () => {
          for (const record of active) {
            await record.markAsDeleted() // Soft delete - keeps record for sync
          }
        })
        console.log(`   ✅ Marked ${active.length} records as deleted in ${table}`)
      }
    }

    // Clear all data tables but preserve users
    // Order matters: delete children before parents
    console.log('🗑️ Soft-deleting activity items...')
    await softDeleteAll<ActivityItem>('activity_items')
    
    console.log('🗑️ Soft-deleting flights...')
    await softDeleteAll<Flight>('flights')
    
    console.log('🗑️ Soft-deleting trip items...')
    await softDeleteAll<TripItem>('trip_items')
    
    console.log('🗑️ Soft-deleting trips...')
    await softDeleteAll<Trip>('trips')
    
    console.log('✅ All data soft-deleted successfully (users preserved)')
    console.log('ℹ️  Records are marked as deleted and will be synced to server')
    console.log('ℹ️  Call clearAllDataPermanently() after sync to purge soft-deleted records')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  }
}

/**
 * Permanently destroy all soft-deleted records
 * Should be called AFTER sync completes to purge the database
 */
export const clearAllDataPermanently = async () => {
  try {
    console.log('🗑️ Permanently destroying soft-deleted records...')
    
    const destroyAll = async <T extends Model>(table: string) => {
      const collection = database.get<T>(table as any)
      // Get only soft-deleted records
      const softDeleted = await collection.query(Q.where('_status', 'deleted')).fetch()
      
      if (softDeleted.length > 0) {
        console.log(`   Found ${softDeleted.length} soft-deleted records in ${table}`)
        await database.write(async () => {
          for (const record of softDeleted) {
            await record.destroyPermanently() // Permanent delete - removes from DB
          }
        })
        console.log(`   ✅ Permanently destroyed ${softDeleted.length} records from ${table}`)
      }
    }

    // Destroy soft-deleted records
    await destroyAll<ActivityItem>('activity_items')
    await destroyAll<Flight>('flights')
    await destroyAll<TripItem>('trip_items')
    await destroyAll<Trip>('trips')
    
    console.log('✅ All soft-deleted records permanently destroyed')
  } catch (error) {
    console.error('❌ Error permanently destroying records:', error)
    throw error
  }
}
