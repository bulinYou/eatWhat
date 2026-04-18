import { DietRecord, DailySummary } from '@diet-tracker/types'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function calculateDailySummary(records: DietRecord[]): DailySummary {
  const summary = records.reduce(
    (acc, record) => ({
      totalCalories: acc.totalCalories + record.calories,
      totalProtein: acc.totalProtein + record.protein,
      totalCarbs: acc.totalCarbs + record.carbs,
      totalFat: acc.totalFat + record.fat,
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  )

  return {
    date: records[0]?.date || new Date().toISOString().split('T')[0],
    ...summary,
    records,
  }
}

export function filterRecordsByDate(records: DietRecord[], date: string): DietRecord[] {
  return records.filter((record) => record.date === date)
}

export function filterRecordsByDateRange(
  records: DietRecord[],
  startDate: string,
  endDate: string
): DietRecord[] {
  return records.filter((record) => {
    return record.date >= startDate && record.date <= endDate
  })
}
