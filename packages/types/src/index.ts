export interface DietRecord {
  id: string
  date: string
  mealType: MealType
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  grams: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface DailySummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  records: DietRecord[]
}

export interface UserGoals {
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
