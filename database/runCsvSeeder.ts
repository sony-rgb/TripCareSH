import { seedFromCSV } from './csvSeeder'

// Simple script to run the CSV seeder
export const runCsvSeeder = async () => {
  try {
    console.log('🚀 Starting CSV seeder...')
    await seedFromCSV()
    console.log('✅ CSV seeder completed successfully!')
  } catch (error) {
    console.error('❌ CSV seeder failed:', error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runCsvSeeder()
}
