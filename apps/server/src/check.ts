import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  const db = drizzle(pool)
  
  const result = await db.execute('SELECT id, date, food_name FROM diet_records ORDER BY created_at DESC LIMIT 10')
  
  console.log('Total rows:', result.rows.length)
  result.rows.forEach((row: any) => {
    console.log(`  ${row.id} | ${row.date} | ${row.food_name}`)
  })
  
  await pool.end()
}

check().catch(console.error)
