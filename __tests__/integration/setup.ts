import 'dotenv/config'

// Integration test setup - loads environment variables
console.log('Integration test setup loaded')
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
