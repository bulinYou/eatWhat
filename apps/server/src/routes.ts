import { Router, Request, Response } from 'express'
import {
  getAllRecords,
  getRecordsByDate,
  getRecordsByDateRange,
  createRecord,
  updateRecord,
  deleteRecord,
  getUserGoals,
  updateUserGoals,
} from './db.js'
import { MealType } from '@diet-tracker/types'
import { calculateDailySummary } from '@diet-tracker/utils'

const router: Router = Router()

router.get('/records', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, date } = req.query
    
    if (date) {
      const records = await getRecordsByDate(date as string)
      const summary = calculateDailySummary(records)
      return res.json({ success: true, data: { records, summary } })
    }
    
    if (startDate && endDate) {
      const records = await getRecordsByDateRange(startDate as string, endDate as string)
      return res.json({ success: true, data: { records } })
    }
    
    const records = await getAllRecords()
    res.json({ success: true, data: { records } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch records' })
  }
})

router.post('/records', async (req: Request, res: Response) => {
  try {
    const { date, mealType, foodName, calories, protein, carbs, fat, notes } = req.body
    
    if (!date || !mealType || !foodName || calories === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }
    
    const validMealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({ success: false, error: 'Invalid meal type' })
    }
    
    const record = await createRecord({
      date,
      mealType,
      foodName,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      grams: 0,
      notes,
    })
    
    res.status(201).json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create record' })
  }
})

router.put('/records/:id', async (req: Request, res: Response) => {
  try {
    const record = await updateRecord(req.params.id, req.body)
    
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' })
    }
    
    res.json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update record' })
  }
})

router.delete('/records/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await deleteRecord(req.params.id)
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Record not found' })
    }
    
    res.json({ success: true, message: 'Record deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete record' })
  }
})

router.get('/goals', async (req: Request, res: Response) => {
  try {
    const goals = await getUserGoals()
    res.json({ success: true, data: goals })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch goals' })
  }
})

router.get('/today-log', async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    console.log('Fetching records for date:', today)
    const records = await getRecordsByDate(today)
    console.log('Found records:', records.length, JSON.stringify(records, null, 2))
    
    const foodItems = records.map(record => {
      const notes = record.notes || ''
      const parts = notes.split('|')
      
      let image: string | undefined
      let time: string | undefined
      
      if (parts.length === 2) {
        if (parts[0].match(/^\d{1,2}:\d{2}\s*[AP]M$/i)) {
          time = parts[0]
          image = parts[1] || undefined
        } else {
          image = parts[0] || undefined
          time = parts[1] || undefined
        }
      } else if (parts.length === 1) {
        if (parts[0].match(/^\d{1,2}:\d{2}\s*[AP]M$/i)) {
          time = parts[0]
        } else if (parts[0].startsWith('http')) {
          image = parts[0]
        }
      }
      
      return {
        id: record.id,
        name: record.foodName,
        calories: record.calories,
        time,
        image,
        type: image ? 'image' : 'simple' as const,
        mealType: record.mealType,
        protein: record.protein,
        carbs: record.carbs,
        fat: record.fat,
        grams: record.grams,
      }
    })
    
    const summary = calculateDailySummary(records)
    console.log('Returning foodItems:', foodItems.length)
    
    res.json({ success: true, data: { foodItems, summary } })
  } catch (error) {
    console.error('Error in /today-log:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch today log' })
  }
})

router.put('/goals', async (req: Request, res: Response) => {
  try {
    const goals = await updateUserGoals(req.body)
    res.json({ success: true, data: goals })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update goals' })
  }
})

router.post('/today-log', async (req: Request, res: Response) => {
  try {
    const { foodName, calories, protein, carbs, fat, grams, notes, mealType } = req.body
    
    if (!foodName) {
      return res.status(400).json({ success: false, error: 'Food name is required' })
    }
    
    const today = new Date().toISOString().split('T')[0]
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    const record = await createRecord({
      date: today,
      mealType: mealType || 'snack',
      foodName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      grams: Number(grams) || 0,
      notes: notes || timeString,
    })
    
    res.status(201).json({ success: true, data: record })
  } catch (error) {
    console.error('Error in /today-log POST:', error)
    res.status(500).json({ success: false, error: 'Failed to create record' })
  }
})

export default router
