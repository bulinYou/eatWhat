import { useState, useEffect } from 'react'

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

const quickAddOptions = ['+ 100 千卡', '+ 250 千卡', '+ 咖啡', '+ 苹果']

interface HomeProps {
  onOpenHistory: () => void
}

function Home({ onOpenHistory }: HomeProps) {
  const [inputValue, setInputValue] = useState('')
  const [inputMode, setInputMode] = useState<'voice' | 'keyboard'>('keyboard')
  const [isRecording, setIsRecording] = useState(false)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/today-log')
      .then(res => {
        console.log('Response status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('API response:', JSON.stringify(data, null, 2))
        if (data.success) {
          setFoodItems(data.data.foodItems)
          setSummary(data.data.summary)
        } else {
          console.error('API returned error:', data.error)
        }
      })
      .catch(err => console.error('Failed to fetch today log:', err))
      .finally(() => setLoading(false))
  }, [])

  const totalCalories = 2200
  const currentCalories = summary?.totalCalories || 0
  const progressPercent = (currentCalories / totalCalories) * 100

  const protein = summary?.totalProtein || 0
  const carbs = summary?.totalCarbs || 0
  const fat = summary?.totalFat || 0

  const handleQuickAdd = (option: string) => {
    console.log('Quick add:', option)
  }

  const handleSubmit = async () => {
    if (!inputValue.trim()) return

    try {
      const response = await fetch('/api/today-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName: inputValue.trim() }),
      })

      const data = await response.json()
      if (data.success) {
        setInputValue('')
        const res = await fetch('/api/today-log')
        const newData = await res.json()
        if (newData.success) {
          setFoodItems(newData.data.foodItems)
          setSummary(newData.data.summary)
        }
      }
    } catch (error) {
      console.error('Failed to save record:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <span className="material-symbols-outlined text-[var(--primary)] animate-spin text-4xl">
          progress_activity
        </span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <div
        className={`min-h-screen bg-[var(--background)] text-[var(--on-surface)] font-body pb-32 text-[0.9375rem] leading-[1.4] transition-transform duration-200 ease-out ${
          settingsOpen ? 'translate-x-[50%]' : 'translate-x-0'
        }`}
      >
        <header className="sticky top-0 z-50 bg-[var(--background)] flex items-center justify-between px-5 py-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--primary-container)] cursor-pointer transition-transform active:scale-95"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeClae_akq-Q_Zk3UCyFmWsFJcdA1EZzIMIzYSlTUWXu3zSQQrz0nkvGBijVuf_Y4h90CthgFsys_6YeMUVpT7n4T7q2BdyA5NFeOLbY-PS8m8t_erFVhmc0xuZEJYt9dEpiix5wTw87BrnUltBMFevl14GRbm5ydca-SMbSgvY5d9ErVjBOfPNGvLRQ4IJJIFjRRzCsfhx9KUyvyU3xGEaemCMsarSqiI5I-OmaS1WuoSFKfj8_KXCXOUyEE5l4F6bjdj6EUM1S_p"
              alt="user profile"
              className="w-full h-full object-cover"
            />
          </button>
        <h1 className="font-display text-xl font-extrabold text-[var(--primary)] tracking-tight">
          健康食志
        </h1>
        <button
          onClick={onOpenHistory}
          className="p-1.5 rounded-full text-[var(--primary)] hover:bg-[var(--surface-container-low)] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">history</span>
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 flex flex-col gap-5 pt-2">
        <section className="bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] p-5 shadow-[0_8px_24px_rgba(25,28,27,0.05)] relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[var(--on-surface-variant)] font-semibold tracking-wide text-[0.8125rem] uppercase">
              今日热量
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--on-surface)]">
                {currentCalories.toLocaleString()}
              </span>
              <span className="text-[var(--on-surface-variant)] text-lg font-medium">
                / {totalCalories.toLocaleString()} 千卡
              </span>
            </div>
            <div className="mt-5 h-3 w-full bg-[var(--surface-container-high)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex flex-col">
                <span className="text-[0.7rem] text-[var(--on-surface-variant)] font-bold">蛋白质</span>
                <span className="text-base font-bold text-[var(--on-surface)]">{protein}g</span>
              </div>
              <div className="flex flex-col items-center border-x border-[rgba(114,121,105,0.1)] px-6">
                <span className="text-[0.7rem] text-[var(--on-surface-variant)] font-bold">碳水</span>
                <span className="text-base font-bold text-[var(--on-surface)]">{carbs}g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.7rem] text-[var(--on-surface-variant)] font-bold">脂肪</span>
                <span className="text-base font-bold text-[var(--on-surface)]">{fat}g</span>
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-[rgba(57,106,5,0.04)] rounded-full blur-[40px]" />
        </section>

        <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickAddOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleQuickAdd(option)}
              className="bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] border-none px-4 py-1.5 rounded-full text-[0.8125rem] font-bold whitespace-nowrap cursor-pointer transition-transform active:scale-95"
            >
              {option}
            </button>
          ))}
        </section>

        <section>
          <h2 className="font-display text-xl font-extrabold text-[var(--on-surface)] mb-4 tracking-tight">
            今日饮食日志
          </h2>
          <div className="columns-2 gap-3">
            {foodItems.map((item) =>
              item.type === 'image' && item.image ? (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-3 bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] overflow-hidden border border-[rgba(194,201,182,0.1)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: item.mealType === 'breakfast' ? '4/5' : item.mealType === 'lunch' ? '1/1' : '3/4' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <p className="font-bold text-base leading-tight text-[var(--on-surface)]">{item.name}</p>
                        <p className="text-xs font-medium text-[var(--primary)]">{item.calories} 千卡</p>
                      </div>
                      {item.grams > 0 && (
                        <span className="text-[0.6875rem] text-[var(--on-surface-variant)] font-medium">{item.grams}g</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-3 bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] p-3.5 border border-[rgba(194,201,182,0.1)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.mealType === 'breakfast'
                          ? 'bg-[var(--secondary-container)] text-[var(--on-secondary)]'
                          : 'bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {item.mealType === 'breakfast' ? 'coffee' : 'nutrition'}
                      </span>
                    </div>
                    {item.time && (
                      <span className="text-[var(--on-surface-variant)] font-bold text-xs">
                        {item.time}
                      </span>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-white/80 to-white/40 rounded-lg p-2 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-base text-[var(--on-surface)]">{item.name}</p>
                        <p className="text-[var(--primary)] font-semibold text-[0.8125rem]">{item.calories} 千卡</p>
                      </div>
                      {item.grams > 0 && (
                        <span className="text-[0.6875rem] text-[var(--on-surface-variant)] font-medium">{item.grams}g</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-[100] bg-[rgba(248,250,248,0.85)] backdrop-blur-[20px] px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0.75rem))] border-t border-[rgba(194,201,182,0.15)] shadow-[0_-8px_30px_rgba(25,28,27,0.06)]">
        <div className="bg-[var(--surface-container-high)] rounded-full flex items-center p-1 max-w-2xl mx-auto gap-1">
          {inputMode === 'keyboard' ? (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="今天吃了什么？"
                className="bg-transparent border-none flex-1 px-2.5 text-[var(--on-surface)] font-medium outline-none placeholder:text-[rgba(66,73,58,0.5)] text-[0.9375rem]"
              />
              <button
                onClick={handleSubmit}
                className="px-3 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_2px_5px_rgba(57,106,5,0.25)] text-sm font-medium"
              >
                发送
              </button>
            </>
          ) : (
            <>
              <button
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => setIsRecording(false)}
                className={`flex-1 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-[var(--error)]'
                    : 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)]'
                }`}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                  {isRecording ? 'mic' : 'mic'}
                </span>
                <span className="ml-1 text-white text-sm font-medium">
                  {isRecording ? '正在录音...' : '按住说话'}
                </span>
              </button>
              <button
                onClick={() => setInputMode('keyboard')}
                className="w-9 h-9 rounded-full bg-[var(--surface-container-lowest)] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[var(--on-surface-variant)]" style={{ fontSize: '20px' }}>
                  keyboard
                </span>
              </button>
            </>
          )}
        </div>
      </nav>
      </div>

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[200]"
          onClick={() => setSettingsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <div
        className={`fixed top-0 left-0 z-[250] h-full w-[70%] bg-[var(--surface-container-lowest)] shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-200 ease-out ${
          settingsOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(194,201,182,0.15)]">
          <h2 className="font-display text-lg font-bold text-[var(--on-surface)]">设置</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-container)] transition-colors"
          >
            <span className="material-symbols-outlined text-[var(--on-surface)]" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[rgba(194,201,182,0.15)]">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--primary-container)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeClae_akq-Q_Zk3UCyFmWsFJcdA1EZzIMIzYSlTUWXu3zSQQrz0nkvGBijVuf_Y4h90CthgFsys_6YeMUVpT7n4T7q2BdyA5NFeOLbY-PS8m8t_erFVhmc0xuZEJYt9dEpiix5wTw87BrnUltBMFevl14GRbm5ydca-SMbSgvY5d9ErVjBOfPNGvLRQ4IJJIFjRRzCsfhx9KUyvyU3xGEaemCMsarSqiI5I-OmaS1WuoSFKfj8_KXCXOUyEE5l4F6bjdj6EUM1S_p"
                alt="user profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-[var(--on-surface)]">用户名称</p>
              <p className="text-sm text-[var(--on-surface-variant)]">健康饮食达人</p>
            </div>
          </div>
          <div className="flex justify-between pb-4 border-b border-[rgba(194,201,182,0.15)]">
            <div className="flex flex-col">
              <span className="text-[0.65rem] text-[rgba(114,121,105,0.5)] font-medium">身高</span>
              <span className="text-[0.8125rem] text-[rgba(114,121,105,0.6)] font-medium">175cm</span>
            </div>
            <div className="flex flex-col items-center border-x border-[rgba(114,121,105,0.08)] px-8">
              <span className="text-[0.65rem] text-[rgba(114,121,105,0.5)] font-medium">体重</span>
              <span className="text-[0.8125rem] text-[rgba(114,121,105,0.6)] font-medium">70kg</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.65rem] text-[rgba(114,121,105,0.5)] font-medium">年龄</span>
              <span className="text-[0.8125rem] text-[rgba(114,121,105,0.6)] font-medium">28岁</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] font-medium">
              每日热量目标
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] font-medium">
              饮食偏好设置
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] font-medium">
              通知设置
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)] font-medium">
              导出数据
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
