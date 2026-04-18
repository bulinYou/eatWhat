// home.ts
import { getTodayLog, addTodayLog } from '../../utils/api'

const app = getApp<IAppOption>()

interface FoodItem {
  id: string
  name: string
  calories: number
  time?: string
  image?: string
  type: 'image' | 'simple'
  mealType: string
  protein: number
  carbs: number
  fat: number
  grams: number
}

interface DailySummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

Page({
  data: {
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeClae_akq-Q_Zk3UCyFmWsFJcdA1EZzIMIzYSlTUWXu3zSQQrz0nkvGBijVuf_Y4h90CthgFsys_6YeMUVpT7n4T7q2BdyA5NFeOLbY-PS8m8t_erFVhmc0xuZEJYt9dEpiix5wTw87BrnUltBMFevl14GRbm5ydca-SMbSgvY5d9ErVjBOfPNGvLRQ4IJJIFjRRzCsfhx9KUyvyU3xGEaemCMsarSqiI5I-OmaS1WuoSFKfj8_KXCXOUyEE5l4F6bjdj6EUM1S_p',
    inputValue: '',
    inputMode: 'keyboard' as 'voice' | 'keyboard',
    isRecording: false,
    foodItems: [] as FoodItem[],
    summary: null as DailySummary | null,
    loading: true,
    settingsOpen: false,
    totalCalories: 2200,
    currentCalories: 0,
    progressPercent: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quickAddOptions: ['+ 100 千卡', '+ 250 千卡', '+ 咖啡', '+ 苹果'],
  },

  onLoad() {
    this.fetchTodayLog()
  },

  async fetchTodayLog() {
    try {
      const res = await getTodayLog()

      if (res.success && res.data) {
        const data = res.data as any
        this.setData({
          foodItems: data.foodItems,
          summary: data.summary,
          currentCalories: data.summary?.totalCalories || 0,
          progressPercent: ((data.summary?.totalCalories || 0) / 2200) * 100,
          protein: data.summary?.totalProtein || 0,
          carbs: data.summary?.totalCarbs || 0,
          fat: data.summary?.totalFat || 0,
          loading: false,
        })
      }
    } catch (err) {
      console.error('Failed to fetch today log:', err)
      this.setData({ loading: false })
    }
  },

  onInputChange(e: any) {
    this.setData({
      inputValue: e.detail.value,
    })
  },

  async handleSubmit() {
    const { inputValue } = this.data
    if (!inputValue.trim()) return

    try {
      const res = await addTodayLog({ foodName: inputValue.trim() })

      if (res.success) {
        this.setData({ inputValue: '' })
        await this.fetchTodayLog()
      }
    } catch (err) {
      console.error('Failed to save record:', err)
    }
  },

  handleQuickAdd(e: any) {
    const option = e.currentTarget.dataset.option
    console.log('Quick add:', option)
  },

  onVoiceStart() {
    this.setData({ isRecording: true })
  },

  onVoiceEnd() {
    this.setData({ isRecording: false })
  },

  switchToKeyboard() {
    this.setData({ inputMode: 'keyboard' })
  },

  switchToVoice() {
    this.setData({ inputMode: 'voice' })
  },

  openSettings() {
    this.setData({ settingsOpen: true })
  },

  closeSettings() {
    this.setData({ settingsOpen: false })
  },

  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },
})
