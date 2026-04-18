<template>
  <view class="home-container">
    <!-- 主内容包裹层 -->
    <view 
      :class="['main-wrapper', settingsOpen && !isDragging ? 'shifted' : '']" 
      :style="mainWrapperStyle"
      @touchstart="onMainTouchStart"
      @touchmove="onMainTouchMove"
      @touchend="onMainTouchEnd"
    >
      <!-- 头部导航 -->
      <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="avatar" @tap="openSettings">
          <image :src="avatarUrl" mode="aspectFill" class="avatar-img" />
        </view>
        <text class="title">健康食志</text>
        <view class="history-btn" @tap="goToHistory">
          <text class="icon-text">📋</text>
        </view>
      </view>

      <!-- 主内容区 -->
      <view class="main-content">
      <!-- 今日热量卡片 -->
      <view class="calorie-card">
        <view class="calorie-content">
          <text class="calorie-label">今日热量</text>
          <view class="calorie-value-row">
            <text class="calorie-value">{{ currentCalories.toLocaleString() }}</text>
            <text class="calorie-total">/ {{ totalCalories.toLocaleString() }} 千卡</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progressPercent + '%' }" />
          </view>
          <view class="macros-row">
            <view class="macro-item">
              <text class="macro-label">蛋白质</text>
              <text class="macro-value">{{ protein }}g</text>
            </view>
            <view class="macro-item divider">
              <text class="macro-label">碳水</text>
              <text class="macro-value">{{ carbs }}g</text>
            </view>
            <view class="macro-item">
              <text class="macro-label">脂肪</text>
              <text class="macro-value">{{ fat }}g</text>
            </view>
          </view>
        </view>
        <view class="calorie-bg" />
      </view>

      <!-- 快捷添加按钮 -->
      <scroll-view class="quick-add-scroll" scroll-x>
        <view class="quick-add-row">
          <view
            v-for="option in quickAddOptions"
            :key="option"
            class="quick-add-btn"
            @tap="handleQuickAdd(option)"
          >
            <text>{{ option }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 今日饮食日志 -->
      <view class="log-section">
        <text class="log-title">今日饮食日志</text>
        <view class="waterfall-container">
          <view class="waterfall-column">
            <view
              v-for="item in leftColumnItems"
              :key="item.id"
              :class="['food-item', item.type === 'image' && item.image ? 'image-type' : 'simple-type']"
            >
              <!-- 图片类型 -->
              <view v-if="item.type === 'image' && item.image" class="image-wrapper">
                <image
                  :src="item.image"
                  mode="widthFix"
                  class="food-image"
                />
                <view class="image-overlay" />
                <view class="image-info">
                  <view class="image-text">
                    <text class="food-name">{{ item.name }}</text>
                    <text class="food-calories">{{ item.calories }} 千卡</text>
                  </view>
                  <text v-if="item.grams > 0" class="food-grams">{{ item.grams }}g</text>
                </view>
              </view>
              <!-- 简单类型 -->
              <view v-else class="simple-content">
                <view class="simple-header">
                  <view :class="['icon-circle', item.mealType === 'breakfast' ? 'breakfast-icon' : 'other-icon']">
                    <text class="icon-text">{{ item.mealType === 'breakfast' ? '☕' : '🥗' }}</text>
                  </view>
                  <text v-if="item.time" class="food-time">{{ item.time }}</text>
                </view>
                <view class="simple-info">
                  <view class="simple-text">
                    <text class="food-name">{{ item.name }}</text>
                    <text class="food-calories">{{ item.calories }} 千卡</text>
                  </view>
                  <text v-if="item.grams > 0" class="food-grams">{{ item.grams }}g</text>
                </view>
              </view>
            </view>
          </view>
          <view class="waterfall-column">
            <view
              v-for="item in rightColumnItems"
              :key="item.id"
              :class="['food-item', item.type === 'image' && item.image ? 'image-type' : 'simple-type']"
            >
              <!-- 图片类型 -->
              <view v-if="item.type === 'image' && item.image" class="image-wrapper">
                <image
                  :src="item.image"
                  mode="widthFix"
                  class="food-image"
                />
                <view class="image-overlay" />
                <view class="image-info">
                  <view class="image-text">
                    <text class="food-name">{{ item.name }}</text>
                    <text class="food-calories">{{ item.calories }} 千卡</text>
                  </view>
                  <text v-if="item.grams > 0" class="food-grams">{{ item.grams }}g</text>
                </view>
              </view>
              <!-- 简单类型 -->
              <view v-else class="simple-content">
                <view class="simple-header">
                  <view :class="['icon-circle', item.mealType === 'breakfast' ? 'breakfast-icon' : 'other-icon']">
                    <text class="icon-text">{{ item.mealType === 'breakfast' ? '☕' : '🥗' }}</text>
                  </view>
                  <text v-if="item.time" class="food-time">{{ item.time }}</text>
                </view>
                <view class="simple-info">
                  <view class="simple-text">
                    <text class="food-name">{{ item.name }}</text>
                    <text class="food-calories">{{ item.calories }} 千卡</text>
                  </view>
                  <text v-if="item.grams > 0" class="food-grams">{{ item.grams }}g</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

    <!-- 底部输入导航 -->
    <view class="bottom-nav">
      <view class="input-container">
        <template v-if="inputMode === 'keyboard'">
          <input
            class="input-field"
            :value="inputValue"
            @input="onInputChange"
            @confirm="handleSubmit"
            placeholder="今天吃了什么？"
            placeholder-class="input-placeholder"
            confirm-type="send"
          />
          <view class="submit-btn" @tap="handleSubmit">
            <text class="submit-text">发送</text>
          </view>
        </template>
        <!-- 语音模式 -->
        <template v-else>
          <view
            :class="['voice-btn', isRecording ? 'recording' : '']"
            @touchstart="onVoiceStart"
            @touchend="onVoiceEnd"
          >
            <text class="voice-icon-text">🎤</text>
            <text class="voice-text">{{ isRecording ? '正在录音...' : '按住说话' }}</text>
          </view>
          <view class="keyboard-switch-btn" @tap="switchToKeyboard">
            <text class="keyboard-text">⌨️</text>
          </view>
        </template>
      </view>
    </view>

    <!-- 设置面板遮罩 -->
    <view 
      v-if="settingsOpen || isDragging" 
      class="settings-mask" 
      :style="maskStyle"
      @tap="closeSettings" 
    />

    <!-- 设置面板 -->
    <view 
      :class="['settings-panel', settingsOpen ? 'open' : '']"
      :style="settingsPanelStyle"
      @touchstart="onSettingsTouchStart"
      @touchmove="onSettingsTouchMove"
      @touchend="onSettingsTouchEnd"
    >
      <view class="settings-header" :style="{ paddingTop: statusBarHeight + 'px', paddingRight: settingsHeaderRightPadding + 'px' }">
        <text class="settings-title">设置</text>
      </view>
      <view class="settings-content">
        <view class="user-info">
          <view class="user-avatar">
            <image :src="avatarUrl" mode="aspectFill" class="user-avatar-img" />
          </view>
          <view class="user-text">
            <text class="user-name">用户名称</text>
            <text class="user-desc">健康饮食达人</text>
          </view>
        </view>
        <view class="body-info">
          <view class="body-item">
            <text class="body-label">身高</text>
            <text class="body-value">175cm</text>
          </view>
          <view class="body-item divider">
            <text class="body-label">体重</text>
            <text class="body-value">70kg</text>
          </view>
          <view class="body-item">
            <text class="body-label">年龄</text>
            <text class="body-value">28岁</text>
          </view>
        </view>
        <view class="settings-menu">
          <view class="menu-item">
            <text class="menu-text">每日热量目标</text>
          </view>
          <view class="menu-item">
            <text class="menu-text">饮食偏好设置</text>
          </view>
          <view class="menu-item">
            <text class="menu-text">通知设置</text>
          </view>
          <view class="menu-item">
            <text class="menu-text">导出数据</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTodayLog, addTodayLog } from '../../utils/api'
import { onBackPress } from '@dcloudio/uni-app'

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

const avatarUrl = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuCeClae_akq-Q_Zk3UCyFmWsFJcdA1EZzIMIzYSlTUWXu3zSQQrz0nkvGBijVuf_Y4h90CthgFsys_6YeMUVpT7n4T7q2BdyA5NFeOLbY-PS8m8t_erFVhmc0xuZEJYt9dEpiix5wTw87BrnUltBMFevl14GRbm5ydca-SMbSgvY5d9ErVjBOfPNGvLRQ4IJJIFjRRzCsfhx9KUyvyU3xGEaemCMsarSqiI5I-OmaS1WuoSFKfj8_KXCXOUyEE5l4F6bjdj6EUM1S_p')
const statusBarHeight = ref(0)
const settingsHeaderRightPadding = ref(40)
const inputValue = ref('')
const inputMode = ref<'voice' | 'keyboard'>('keyboard')
const isRecording = ref(false)
const foodItems = ref<FoodItem[]>([])
const summary = ref<DailySummary | null>(null)
const loading = ref(true)
const settingsOpen = ref(false)
const totalCalories = ref(2200)

// 手势滑动相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchDeltaX = ref(0)
const isDragging = ref(false)
const isSettingsDragging = ref(false)

const currentCalories = computed(() => summary.value?.totalCalories || 0)
const progressPercent = computed(() => (currentCalories.value / totalCalories.value) * 100)
const protein = computed(() => summary.value?.totalProtein || 0)
const carbs = computed(() => summary.value?.totalCarbs || 0)
const fat = computed(() => summary.value?.totalFat || 0)

// 设置面板动态样式
const settingsPanelStyle = computed(() => {
  if (isDragging.value) {
    // 首页右滑时，设置面板从左侧滑出
    const translateX = -100 + (touchDeltaX.value / 375) * 100
    return {
      transform: `translateX(${translateX}%)`,
      transition: 'none'
    }
  }
  
  if (isSettingsDragging.value) {
    // 设置页左滑关闭时
    const translateX = (touchDeltaX.value / 375) * 100
    return {
      transform: `translateX(${translateX}%)`,
      transition: 'none'
    }
  }
  
  return {}
})

// 遮罩层动态样式
const maskStyle = computed(() => {
  if (isDragging.value) {
    // 首页右滑时，遮罩层透明度跟随滑动距离
    const opacity = Math.min(touchDeltaX.value / 375, 0.3)
    return {
      opacity: opacity,
      transition: 'none'
    }
  }
  
  if (isSettingsDragging.value) {
    // 设置页左滑关闭时，遮罩层透明度减小
    const opacity = 0.3 * (1 - Math.abs(touchDeltaX.value) / 375)
    return {
      opacity: Math.max(opacity, 0),
      transition: 'none'
    }
  }
  
  return {}
})

// 首页主内容动态样式
const mainWrapperStyle = computed(() => {
  if (!isDragging.value && !isSettingsDragging.value) return {}
  
  if (isSettingsDragging.value) {
    // 设置页滑动时，首页缩放从 0.9 恢复到 1
    const progress = Math.min(Math.abs(touchDeltaX.value) / 375, 1)
    const scale = 0.9 + 0.1 * progress
    return {
      transform: `scale(${scale})`,
      transition: 'none'
    }
  }
  
  // 首页右滑时，缩放从 1 减小到 0.9
  const progress = Math.min(touchDeltaX.value / 375, 1)
  const scale = 1 - 0.1 * progress
  return {
    transform: `scale(${scale})`,
    transition: 'none'
  }
})

const leftColumnItems = ref<FoodItem[]>([])
const rightColumnItems = ref<FoodItem[]>([])

const quickAddOptions = ['+ 100 千卡', '+ 250 千卡', '+ 咖啡', '+ 苹果']

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight
  
  // 获取胶囊按钮位置信息，计算设置头部右侧 padding
  const menuButton = uni.getMenuButtonBoundingClientRect()
  // 右侧 padding = 屏幕宽度 - 胶囊按钮右边界 + 胶囊按钮宽度（确保关闭按钮在胶囊左侧）
  const rightPadding = systemInfo.screenWidth - menuButton.left + 20
  settingsHeaderRightPadding.value = rightPadding
  
  fetchTodayLog()
})

// 拦截返回操作（滑动返回、快捷返回等）
onBackPress(() => {
  if (settingsOpen.value) {
    closeSettings()
    return true
  }
  return false
})

async function fetchTodayLog() {
  try {
    const res = await getTodayLog()
    if (res.success && res.data) {
      const data = res.data as any
      foodItems.value = data.foodItems
      summary.value = data.summary
      distributeWaterfallItems()
      loading.value = false
    }
  } catch (err) {
    console.error('Failed to fetch today log:', err)
    loading.value = false
  }
}

function distributeWaterfallItems() {
  leftColumnItems.value = []
  rightColumnItems.value = []

  let leftHeight = 0
  let rightHeight = 0

  foodItems.value.forEach((item) => {
    const itemHeight = getItemHeight(item)

    if (leftHeight <= rightHeight) {
      leftColumnItems.value.push(item)
      leftHeight += itemHeight
    } else {
      rightColumnItems.value.push(item)
      rightHeight += itemHeight
    }
  })
}

function getItemHeight(item: FoodItem): number {
  if (item.type === 'image' && item.image) {
    return 300
  }
  return 180
}

function onInputChange(e: any) {
  inputValue.value = e.detail.value
}

async function handleSubmit() {
  if (!inputValue.value.trim()) return

  try {
    const res = await addTodayLog({ foodName: inputValue.value.trim() })
    if (res.success) {
      inputValue.value = ''
      await fetchTodayLog()
    }
  } catch (err) {
    console.error('Failed to save record:', err)
  }
}

function handleQuickAdd(option: string) {
  console.log('Quick add:', option)
}

function onVoiceStart() {
  isRecording.value = true
}

function onVoiceEnd() {
  isRecording.value = false
}

function switchToKeyboard() {
  inputMode.value = 'keyboard'
}

function openSettings() {
  settingsOpen.value = true
  isDragging.value = false
  isSettingsDragging.value = false
  touchDeltaX.value = 0
}

function closeSettings() {
  settingsOpen.value = false
  isDragging.value = false
  isSettingsDragging.value = false
  touchDeltaX.value = 0
}

// 首页右滑手势处理
function onMainTouchStart(e: any) {
  if (settingsOpen.value) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
  touchDeltaX.value = 0
}

function onMainTouchMove(e: any) {
  if (!isDragging.value || settingsOpen.value) return
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = e.touches[0].clientY - touchStartY.value
  
  // 只处理水平滑动（水平位移大于垂直位移）
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 只允许向右滑动（deltaX 为正值），向左滑动时不更新
    if (deltaX > 0) {
      touchDeltaX.value = deltaX
      e.preventDefault()
    } else if (deltaX < 0 && touchDeltaX.value > 0) {
      // 如果已经向右滑动了一段，向左滑回时减少 delta
      const newDelta = touchDeltaX.value + deltaX
      touchDeltaX.value = Math.max(0, newDelta)
      e.preventDefault()
    }
  }
}

function onMainTouchEnd() {
  if (!isDragging.value || settingsOpen.value) return
  
  // 如果滑动距离超过 75px，则打开设置
  if (touchDeltaX.value > 75) {
    openSettings()
  } else {
    // 否则恢复原位
    isDragging.value = false
    touchDeltaX.value = 0
  }
}

// 设置面板手势处理
function onSettingsTouchStart(e: any) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSettingsDragging.value = true
}

function onSettingsTouchMove(e: any) {
  if (!isSettingsDragging.value) return
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = e.touches[0].clientY - touchStartY.value
  
  // 只处理水平滑动（水平位移大于垂直位移）
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 只允许向左滑动（deltaX 为负值）
    if (deltaX < 0) {
      touchDeltaX.value = deltaX
      e.preventDefault()
    }
  }
}

function onSettingsTouchEnd() {
  if (!isSettingsDragging.value) return
  
  // 如果滑动距离超过 75px，则关闭设置
  if (Math.abs(touchDeltaX.value) > 75) {
    closeSettings()
  } else {
    // 否则恢复原位
    isSettingsDragging.value = false
    touchDeltaX.value = 0
  }
}

function goToHistory() {
  uni.navigateTo({
    url: '/pages/history/history',
  })
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background-color: var(--background);
  position: relative;
  overflow: hidden;
}

.main-wrapper {
  position: relative;
  z-index: 10;
  transition: transform 0.2s ease-out;
  background-color: var(--background);
  min-height: 100vh;
  transform-origin: left center;
}

.main-wrapper.shifted {
  transform: scale(0.9);
}

/* 头部导航 */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 4rpx solid var(--primary-container);
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.025em;
}

.history-btn {
  padding: 12rpx;
  border-radius: var(--radius-full);
}

.history-btn:active {
  background-color: var(--surface-container-low);
}

.iconfont {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 48rpx;
  color: var(--primary);
}

.icon-text {
  font-size: 48rpx;
}

.voice-icon-text {
  font-size: 40rpx;
}

.keyboard-text {
  font-size: 40rpx;
}

.close-text {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  font-weight: 300;
}

/* 主内容区 */
.main-content {
  max-width: 100%;
  padding: 160rpx 32rpx 200rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 今日热量卡片 */
.calorie-card {
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-default);
  padding: 40rpx;
  box-shadow: 0 16rpx 48rpx rgba(25, 28, 27, 0.05);
  position: relative;
  overflow: hidden;
}

.calorie-content {
  position: relative;
  z-index: 10;
}

.calorie-label {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calorie-value-row {
  margin-top: 8rpx;
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.calorie-value {
  font-size: 120rpx;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.025em;
}

.calorie-total {
  font-size: 36rpx;
  color: var(--on-surface-variant);
  font-weight: 500;
}

.progress-bar {
  margin-top: 40rpx;
  height: 24rpx;
  width: 100%;
  background-color: var(--surface-container-high);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary), var(--primary-container));
  border-radius: var(--radius-full);
  transition: width 0.5s;
}

.macros-row {
  margin-top: 32rpx;
  display: flex;
  justify-content: space-between;
}

.macro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.macro-item.divider {
  border-left: 2rpx solid rgba(114, 121, 105, 0.1);
  border-right: 2rpx solid rgba(114, 121, 105, 0.1);
  padding: 0 48rpx;
}

.macro-label {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  font-weight: 700;
}

.macro-value {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--on-surface);
}

.calorie-bg {
  position: absolute;
  top: -64rpx;
  right: -64rpx;
  width: 320rpx;
  height: 320rpx;
  background-color: rgba(57, 106, 5, 0.04);
  border-radius: 50%;
  filter: blur(80rpx);
}

/* 快捷添加按钮 */
.quick-add-scroll {
  white-space: nowrap;
}

.quick-add-row {
  display: flex;
  gap: 16rpx;
  padding-bottom: 8rpx;
}

.quick-add-btn {
  background-color: var(--primary-fixed);
  color: var(--on-primary-fixed);
  border: none;
  padding: 12rpx 32rpx;
  border-radius: var(--radius-full);
  font-size: 26rpx;
  font-weight: 700;
  white-space: nowrap;
}

.quick-add-btn:active {
  transform: scale(0.95);
}

/* 今日饮食日志 */
.log-section {
  display: flex;
  flex-direction: column;
}

.log-title {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--on-surface);
  margin-bottom: 32rpx;
  letter-spacing: -0.025em;
}

.waterfall-container {
  display: flex;
  gap: 24rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.food-item {
  width: 100%;
  margin-bottom: 24rpx;
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-default);
  overflow: hidden;
  border: 2rpx solid rgba(194, 201, 182, 0.1);
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.04);
}

.food-item.image-type {
  position: relative;
}

.image-wrapper {
  position: relative;
}

.food-image {
  width: 100%;
  height: auto;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
}

.image-info {
  position: absolute;
  bottom: 24rpx;
  left: 24rpx;
  right: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.image-text {
  display: flex;
  flex-direction: column;
}

.food-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.2;
}

.food-calories {
  font-size: 24rpx;
  font-weight: 500;
  color: var(--primary);
}

.food-grams {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  font-weight: 500;
}

/* 简单类型 */
.simple-content {
  padding: 28rpx;
}

.simple-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.icon-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.breakfast-icon {
  background-color: var(--secondary-container);
}

.other-icon {
  background-color: var(--primary-fixed);
}

.icon-text {
  font-size: 40rpx;
}

.food-time {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  font-weight: 700;
}

.simple-info {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.simple-text {
  display: flex;
  flex-direction: column;
}

/* 底部输入导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 100;
  background-color: rgba(248, 250, 248, 0.85);
  backdrop-filter: blur(40rpx);
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom, 48rpx));
  border-top: 2rpx solid rgba(194, 201, 182, 0.15);
  box-shadow: 0 -16rpx 60rpx rgba(25, 28, 27, 0.06);
}

.input-container {
  background-color: var(--surface-container-high);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 8rpx;
  gap: 8rpx;
}

.input-field {
  background-color: transparent;
  border: none;
  flex: 1;
  padding: 0 20rpx;
  font-size: 30rpx;
  color: var(--on-surface);
  font-weight: 500;
}

.input-placeholder {
  color: rgba(66, 73, 58, 0.5);
}

.submit-btn {
  padding: 0 24rpx;
  height: 72rpx;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(57, 106, 5, 0.25);
}

.submit-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.voice-btn {
  flex: 1;
  height: 72rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, var(--primary), var(--primary-container));
  transition: all 0.3s;
}

.voice-btn.recording {
  background-color: var(--error);
}

.voice-icon {
  color: #ffffff;
  font-size: 40rpx;
}

.voice-text {
  margin-left: 8rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.keyboard-switch-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-full);
  background-color: var(--surface-container-lowest);
  display: flex;
  align-items: center;
  justify-content: center;
}

.keyboard-icon {
  color: var(--on-surface-variant);
  font-size: 40rpx;
}

/* 设置面板 */
.settings-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.settings-mask.show {
  opacity: 1;
}

.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 250;
  height: 100vh;
  width: 100%;
  background-color: var(--surface-container-lowest);
  box-shadow: 8rpx 0 48rpx rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
  transition: transform 0.2s ease-out;
}

.settings-panel.open {
  transform: translateX(0);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  border-bottom: 2rpx solid rgba(194, 201, 182, 0.15);
}

.settings-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--on-surface);
}

.settings-close {
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-close:active {
  background-color: var(--surface-container);
}

.close-icon {
  color: var(--on-surface);
  font-size: 40rpx;
}

.settings-content {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding-bottom: 32rpx;
  border-bottom: 2rpx solid rgba(194, 201, 182, 0.15);
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 4rpx solid var(--primary-container);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--on-surface);
}

.user-desc {
  font-size: 26rpx;
  color: var(--on-surface-variant);
}

.body-info {
  display: flex;
  justify-content: space-between;
  padding-bottom: 32rpx;
  border-bottom: 2rpx solid rgba(194, 201, 182, 0.15);
}

.body-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.body-item.divider {
  border-left: 2rpx solid rgba(114, 121, 105, 0.08);
  border-right: 2rpx solid rgba(114, 121, 105, 0.08);
  padding: 0 64rpx;
}

.body-label {
  font-size: 21rpx;
  color: rgba(114, 121, 105, 0.5);
  font-weight: 500;
}

.body-value {
  font-size: 26rpx;
  color: rgba(114, 121, 105, 0.6);
  font-weight: 500;
}

.settings-menu {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
}

.menu-item:active {
  background-color: var(--surface-container);
}

.menu-text {
  font-size: 30rpx;
  color: var(--on-surface);
  font-weight: 500;
}
</style>
