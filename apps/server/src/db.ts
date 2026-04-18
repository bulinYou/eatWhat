import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq, and, gte, lte } from 'drizzle-orm'
import { dietRecords, userGoals } from './schema'
import { DietRecord, UserGoals } from '@diet-tracker/types'
import { generateId } from '@diet-tracker/utils'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool)

export async function initializeDatabase() {
  await pool.query(`
    ALTER TABLE diet_records ADD COLUMN IF NOT EXISTS grams NUMERIC DEFAULT '0'
  `)
  await db.insert(userGoals).values({ id: 1 }).onConflictDoNothing()
  console.log('Database initialized')
}

export async function getAllRecords(): Promise<DietRecord[]> {
  const records = await db
    .select()
    .from(dietRecords)
    .orderBy(dietRecords.date, dietRecords.createdAt)
  return records.map(mapRecord)
}

export async function getRecordsByDate(date: string): Promise<DietRecord[]> {
  const records = await db
    .select()
    .from(dietRecords)
    .where(eq(dietRecords.date, date))
    .orderBy(dietRecords.createdAt)
  return records.map(mapRecord)
}

export async function getRecordsByDateRange(
  startDate: string,
  endDate: string
): Promise<DietRecord[]> {
  const records = await db
    .select()
    .from(dietRecords)
    .where(and(gte(dietRecords.date, startDate), lte(dietRecords.date, endDate)))
    .orderBy(dietRecords.date, dietRecords.createdAt)
  return records.map(mapRecord)
}

export async function createRecord(
  data: Omit<DietRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DietRecord> {
  const now = new Date()
  const id = generateId()

  const [record] = await db
    .insert(dietRecords)
    .values({
      id,
      date: data.date,
      mealType: data.mealType,
      foodName: data.foodName,
      calories: data.calories.toString(),
      protein: data.protein.toString(),
      carbs: data.carbs.toString(),
      fat: data.fat.toString(),
      grams: data.grams?.toString() || '0',
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return mapRecord(record)
}

export async function updateRecord(
  id: string,
  data: Partial<DietRecord>
): Promise<DietRecord | null> {
  const now = new Date()

  const [record] = await db
    .update(dietRecords)
    .set({
      ...(data.date && { date: data.date }),
      ...(data.mealType && { mealType: data.mealType }),
      ...(data.foodName && { foodName: data.foodName }),
      ...(data.calories !== undefined && { calories: data.calories.toString() }),
      ...(data.protein !== undefined && { protein: data.protein.toString() }),
      ...(data.carbs !== undefined && { carbs: data.carbs.toString() }),
      ...(data.fat !== undefined && { fat: data.fat.toString() }),
      ...(data.notes !== undefined && { notes: data.notes }),
      updatedAt: now,
    })
    .where(eq(dietRecords.id, id))
    .returning()

  return record ? mapRecord(record) : null
}

export async function deleteRecord(id: string): Promise<boolean> {
  const result = await db.delete(dietRecords).where(eq(dietRecords.id, id))
  return (result.rowCount ?? 0) > 0
}

export async function getUserGoals(): Promise<UserGoals> {
  const [goals] = await db.select().from(userGoals).where(eq(userGoals.id, 1))
  return {
    dailyCalories: Number(goals.dailyCalories),
    dailyProtein: Number(goals.dailyProtein),
    dailyCarbs: Number(goals.dailyCarbs),
    dailyFat: Number(goals.dailyFat),
  }
}

export async function updateUserGoals(goals: Partial<UserGoals>): Promise<UserGoals> {
  await db
    .update(userGoals)
    .set({
      ...(goals.dailyCalories !== undefined && { dailyCalories: goals.dailyCalories.toString() }),
      ...(goals.dailyProtein !== undefined && { dailyProtein: goals.dailyProtein.toString() }),
      ...(goals.dailyCarbs !== undefined && { dailyCarbs: goals.dailyCarbs.toString() }),
      ...(goals.dailyFat !== undefined && { dailyFat: goals.dailyFat.toString() }),
    })
    .where(eq(userGoals.id, 1))

  return getUserGoals()
}

function mapRecord(record: typeof dietRecords.$inferSelect): DietRecord {
  return {
    id: record.id,
    date: record.date,
    mealType: record.mealType as DietRecord['mealType'],
    foodName: record.foodName,
    calories: Number(record.calories),
    protein: Number(record.protein),
    carbs: Number(record.carbs),
    fat: Number(record.fat),
    notes: record.notes || undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}
