import {
  pgTable,
  text,
  numeric,
  timestamp,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const dietRecords = pgTable('diet_records', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  mealType: text('meal_type').notNull(),
  foodName: text('food_name').notNull(),
  calories: numeric('calories').notNull(),
  protein: numeric('protein').notNull().default('0'),
  carbs: numeric('carbs').notNull().default('0'),
  fat: numeric('fat').notNull().default('0'),
  grams: numeric('grams').notNull().default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userGoals = pgTable('user_goals', {
  id: integer('id').primaryKey().default(1),
  dailyCalories: numeric('daily_calories').notNull().default('2000'),
  dailyProtein: numeric('daily_protein').notNull().default('150'),
  dailyCarbs: numeric('daily_carbs').notNull().default('250'),
  dailyFat: numeric('daily_fat').notNull().default('65'),
})
