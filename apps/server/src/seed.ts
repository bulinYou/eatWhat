import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { dietRecords, userGoals } from './schema'
import { generateId } from '@diet-tracker/utils'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

async function seed() {
  console.log('Connecting to database...')
  console.log('DB URL:', process.env.DATABASE_URL)
  
  console.log('Clearing existing data...')
  const deleteResult = await db.delete(dietRecords)
  console.log('Delete result:', deleteResult)

  const today = new Date().toISOString().split('T')[0]
  console.log('Today date:', today)

  const mockRecords = [
    {
      id: generateId(),
      date: today,
      mealType: 'breakfast',
      foodName: '牛油果吐司',
      calories: '380',
      protein: '12',
      carbs: '35',
      fat: '22',
      grams: '150',
      notes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOSY4rBqa_Kca71EhYLMAh-wcjVH6GxEcFpzyQMFMrobIp0PngYKnja18RIMFPRF_-oahoFOTFc2RIausJvwc6TNpWKKlIgZ7edtMcjKWIjwDIfLChXpzmLWMDqzrqGQGkP5N2da-w9fuRu86SP9XEr9TMxV25Cc2xU3gOc7aUnwPocPmpGLrYfUfmPGs9lmy3b5hP_bdG5FwttPpsCaufsUhw7XcvzX0YNN7lg12w5Bk9iA7vWNrA8KEqCIOvagr3wulgsPoFR4e',
    },
    {
      id: generateId(),
      date: today,
      mealType: 'breakfast',
      foodName: '黑咖啡',
      calories: '5',
      protein: '0',
      carbs: '1',
      fat: '0',
      grams: '250',
      notes: '8:15 AM',
    },
    {
      id: generateId(),
      date: today,
      mealType: 'lunch',
      foodName: '烤鸡肉沙拉',
      calories: '420',
      protein: '35',
      carbs: '25',
      fat: '20',
      grams: '300',
      notes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4Tm4Eb2kGAkcFb30t3Nw3LowAamOVnpZgGE-BlAMTMebwqTte9TYuijjlmVoQB9Q1KypeWMs3BBJswyfHRuWFOm1o7LouU21aSlBaTSRzfyeQXCW3xcAnuGwCMH7ozucjnY_bWsz3tb8C7aQv3RBTdZLQsC8LbFqOdcGIOq2B0cGCgBNXdKDty8nT3zq7jpOuH-9YKGW9TBvkkdrQtV7FA6-TeMqt9vksTqmNfqNkPvGOpzA6bSym5UTBe7mUL1QmAAzaKu8B-iVn',
    },
    {
      id: generateId(),
      date: today,
      mealType: 'snack',
      foodName: '青苹果',
      calories: '95',
      protein: '0',
      carbs: '25',
      fat: '0',
      grams: '180',
      notes: '4:30 PM',
    },
    {
      id: generateId(),
      date: today,
      mealType: 'dinner',
      foodName: '清蒸三文鱼',
      calories: '520',
      protein: '45',
      carbs: '5',
      fat: '35',
      grams: '200',
      notes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxh_pQVS9b528vGrKi6R1ciPMm29dPd_WJ06KUf8NFb66daOSc6gf8aII8-esSrxiP5_NmCCWLbifgogxj9LGisGisAoDdtHywWzRlWHZhLapZI-m_QUrVjsIXY4XKEr6XkEGCiHYbNhHtFezTKHAUcevT023jGWvxwqtBZz5T510kD_5GFWXnEiKythcefmEVMjPSk_gkXZvPb4s1s5OYSfdi6-MNpnl_GOwlictPPicSU_SfA_jrZ3RlHtM3l5eFqgIE2CXYAYvT',
    },
  ]

  console.log('Inserting mock records...')
  await db.insert(dietRecords).values(mockRecords)

  console.log('Mock data seeded successfully!')
  console.log(`Inserted ${mockRecords.length} records for ${today}`)

  await pool.end()
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
