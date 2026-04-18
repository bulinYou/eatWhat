<template>
  <view class="history-container">
    <!-- 头部导航 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-left">
        <view class="back-btn" @tap="goBack">
          <text class="icon-text">←</text>
        </view>
        <text class="page-title">历史记录</text>
      </view>
      <view class="header-right">
        <view class="calendar-btn">
          <text class="icon-text">📅</text>
        </view>
        <view class="user-profile">
          <image :src="avatarUrl" mode="aspectFill" class="profile-img" />
        </view>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 日历组件 -->
      <view class="calendar-container">
        <view class="calendar-header">
          <text class="month-title">2024年10月</text>
          <view class="month-nav">
            <view class="nav-btn">
              <text class="icon-text nav-icon-text">‹</text>
            </view>
            <view class="nav-btn">
              <text class="icon-text nav-icon-text">›</text>
            </view>
          </view>
        </view>
        <view class="calendar-grid">
          <view v-for="day in weekdays" :key="day" class="weekday">{{ day }}</view>
          <view
            v-for="(item, index) in calendarDays"
            :key="index"
            :class="[
              'calendar-day',
              item.otherMonth ? 'other-month' : '',
              item.selected ? 'selected' : '',
              item.hasRecord ? 'has-record' : ''
            ]"
            @tap="selectDay(item)"
          >
            <text>{{ item.day }}</text>
            <view v-if="item.hasRecord && !item.selected" class="record-dot" />
          </view>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-area">
        <text class="icon-text search-icon">🔍</text>
        <input class="search-input" placeholder="搜索过往记录..." placeholder-class="search-placeholder" />
      </view>

      <!-- 历史详情 -->
      <view class="timeline-section">
        <view class="section-header">
          <text class="section-title">历史详情</text>
          <text class="date-range">2024年10月{{ selectedDay }}日</text>
        </view>

        <!-- 选定日期数据卡片 -->
        <view class="log-card elevated">
          <view class="log-card-header">
            <view class="day-info">
              <text class="day-label">选定日期</text>
              <text class="day-date">10月{{ selectedDay }}日</text>
            </view>
            <view class="calories-data">
              <text class="calories-value primary-color">1,840</text>
              <text class="calories-unit">千卡摄入</text>
            </view>
          </view>
          <view class="log-card-footer">
            <view class="tag-icons">
              <view class="tag-icon primary-tag">
                <text class="tag-icon-text">🥚</text>
              </view>
              <view class="tag-icon secondary-tag">
                <text class="tag-icon-text">🍽️</text>
              </view>
              <view class="tag-icon tertiary-tag">
                <text class="tag-icon-text">🥤</text>
              </view>
            </view>
            <text class="tag-description">高蛋白 • 富含膳食纤维</text>
          </view>
        </view>

        <!-- 饮食记录卡片 -->
        <view class="log-card-row">
          <view class="food-photo-thumb">
            <image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkZ7hBe6Vn8i5gzlI0o9oDrxH6k85Qrs-XdMHotjF_ASgUyj2PgcgK4U_Mw-Q3gsDuhOL-qMBJd86Q09e5KA3alOPzMqqxbYqwHso_FXqFJQLp3Kz8tXO3B7wtcYyDysT615RKpoz3olv7UJAzPPIDBDzRsQ6cSt24rfF50SItbMZ-vR7Jk1FVeiUex5Waq9sGuCIhALFDTF8gwW1D6Ylt9MHj3sAE3_YxZHRxJxWkb_QReL4e3CJJbcyNd9j4s4bOvb6C5IrD2WOC"
              mode="aspectFill"
              class="food-img"
            />
          </view>
          <view class="log-card-content">
            <text class="meal-label">早餐饮食</text>
            <text class="meal-name">全麦面包 & 鳄梨</text>
            <view class="cal-row">
              <text class="cal-value">420</text>
              <text class="cal-unit">千卡</text>
            </view>
          </view>
          <text class="icon-text chevron-icon">›</text>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-grid">
        <view class="stats-card full-width">
          <text class="stats-label">月度平均</text>
          <view class="stats-value-group">
            <text class="stats-value">1,895</text>
            <text class="stats-unit">千卡 / 天</text>
          </view>
        </view>
        <view class="stats-card square">
          <text class="stats-icon secondary-icon">trending_up</text>
          <view class="stats-info">
            <text class="stats-label">打卡坚持率</text>
            <text class="stats-value small">88%</text>
          </view>
        </view>
        <view class="stats-card square">
          <text class="stats-icon primary-icon">check_circle</text>
          <view class="stats-info">
            <text class="stats-label">目标达成</text>
            <text class="stats-value small">22 天</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface CalendarDay {
  day: string
  otherMonth?: boolean
  hasRecord?: boolean
  selected?: boolean
}

const avatarUrl = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuBv3K5YH1u1dWr6os2w5CHsjEVAUVwrWGZOR-CyqwIxmPgR7xn9ZrLsFyG0_2lTzUEgURyN3vOrGTomu0N-Q7FZKHH5H9yrwoU9b8u26W1FjoWxGjnv_OuFtZW99XA7Lhtw-pJOO59xsbKhwlhy_1twuSNSzuJp7dUcpgwdis7ITFu6JdiQ2FpzFeoAzH6gjzohswtkml5HV1rYsG9N5nEtRsLDNw1LaoZrhi1-k57oe-Rsht4OpbByn0scmOgRlDkhY-gAOUxEpuHj')
const statusBarHeight = ref(0)
const selectedDay = ref('24')
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const calendarDays = ref<CalendarDay[]>([
  { day: '29', otherMonth: true },
  { day: '30', otherMonth: true },
  { day: '1' },
  { day: '2' },
  { day: '3' },
  { day: '4' },
  { day: '5' },
  { day: '6' },
  { day: '7' },
  { day: '8' },
  { day: '9' },
  { day: '10' },
  { day: '11' },
  { day: '12' },
  { day: '13' },
  { day: '14' },
  { day: '15' },
  { day: '16' },
  { day: '17' },
  { day: '18' },
  { day: '19' },
  { day: '20' },
  { day: '21', hasRecord: true },
  { day: '22', hasRecord: true },
  { day: '23', hasRecord: true },
  { day: '24', hasRecord: true, selected: true },
  { day: '25' },
  { day: '26' },
  { day: '27' },
  { day: '28' },
  { day: '29' },
  { day: '30' },
  { day: '31' },
  { day: '1', otherMonth: true },
  { day: '2', otherMonth: true },
])

function selectDay(item: CalendarDay) {
  if (item.otherMonth) return

  calendarDays.value = calendarDays.value.map((d) => ({
    ...d,
    selected: d.day === item.day,
  }))

  selectedDay.value = item.day
}

function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight
})
</script>

<style scoped lang="scss">
.history-container {
  min-height: 100vh;
  background-color: var(--background);
  padding-bottom: 64rpx;
}

/* 头部导航 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:active {
  background-color: var(--surface-container-low);
}

.page-title {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.025em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.calendar-btn {
  padding: 12rpx;
  border-radius: var(--radius-full);
}

.calendar-btn:active {
  background-color: var(--surface-container-low);
}

.user-profile {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  overflow: hidden;
  background-color: var(--surface-container);
}

.profile-img {
  width: 100%;
  height: 100%;
}

/* 主内容区 */
.main-content {
  max-width: 100%;
  padding: 16rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 日历组件 */
.calendar-container {
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-default);
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(25, 28, 27, 0.04);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.month-title {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--on-surface);
}

.month-nav {
  display: flex;
  gap: 16rpx;
}

.nav-btn {
  padding: 8rpx;
  border-radius: 16rpx;
}

.nav-btn:active {
  background-color: var(--surface-container-low);
}

.nav-icon {
  font-size: 48rpx;
  color: var(--on-surface-variant);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.weekday {
  text-align: center;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--outline);
  padding: 16rpx 0;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  color: var(--on-surface);
  border-radius: 24rpx;
  position: relative;
}

.calendar-day:active {
  background-color: var(--surface-container-low);
}

.calendar-day.other-month {
  color: var(--outline-variant);
}

.calendar-day.selected {
  background-color: var(--primary);
  color: var(--on-primary);
  font-weight: 700;
}

.calendar-day.has-record::after {
  content: '';
  position: absolute;
  bottom: 12rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: var(--primary-container);
}

.record-dot {
  position: absolute;
  bottom: 12rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: var(--primary-container);
}

/* 搜索框 */
.search-area {
  background-color: var(--surface-container-high);
  border-radius: var(--radius-default);
  padding: 0 32rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.search-icon {
  color: var(--on-surface-variant);
  font-size: 48rpx;
}

.search-input {
  background-color: transparent;
  border: none;
  outline: none;
  flex: 1;
  font-size: 30rpx;
  color: var(--on-surface);
  font-weight: 500;
}

.search-placeholder {
  color: rgba(66, 73, 58, 0.5);
}

/* 历史详情 */
.timeline-section {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--on-surface);
}

.date-range {
  color: var(--primary);
  font-size: 28rpx;
  font-weight: 600;
}

/* 日志卡片 */
.log-card {
  border-radius: var(--radius-default);
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.log-card.elevated {
  background-color: var(--surface-container-lowest);
  box-shadow: 0 24rpx 64rpx rgba(25, 28, 27, 0.04);
}

.log-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.day-info {
  display: flex;
  flex-direction: column;
}

.day-label {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.day-date {
  font-size: 48rpx;
  font-weight: 800;
  margin-top: 8rpx;
  color: var(--on-surface);
}

.calories-data {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calories-value {
  font-size: 60rpx;
  font-weight: 900;
  letter-spacing: -0.025em;
}

.primary-color {
  color: var(--primary);
}

.calories-unit {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  font-weight: 500;
}

.log-card-footer {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding-top: 16rpx;
  border-top: 2rpx solid rgba(194, 201, 182, 0.1);
}

.tag-icons {
  display: flex;
  margin-left: 16rpx;
}

.tag-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid var(--surface-container-lowest);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -16rpx;
}

.primary-tag {
  background-color: var(--primary-fixed);
}

.secondary-tag {
  background-color: var(--secondary-fixed);
}

.tertiary-tag {
  background-color: var(--tertiary-fixed);
}

.tag-icon-text {
  font-size: 28rpx;
}

.primary-tag .tag-icon-text {
  color: var(--on-primary-fixed);
}

.secondary-tag .tag-icon-text {
  color: var(--on-secondary-fixed);
}

.tertiary-tag .tag-icon-text {
  color: var(--on-tertiary-fixed);
}

.tag-description {
  color: var(--on-surface-variant);
  font-size: 28rpx;
  font-weight: 500;
}

/* 横向卡片 */
.log-card-row {
  position: relative;
  overflow: hidden;
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-default);
  padding: 48rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 48rpx;
  box-shadow: 0 24rpx 64rpx rgba(25, 28, 27, 0.04);
}

.log-card-row:active {
  transform: scale(0.98);
}

.food-photo-thumb {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.food-img {
  width: 100%;
  height: 100%;
}

.log-card-content {
  flex-grow: 1;
}

.meal-label {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.meal-name {
  font-size: 40rpx;
  font-weight: 800;
  margin-top: 8rpx;
  color: var(--on-surface);
}

.cal-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 8rpx;
}

.cal-value {
  font-size: 40rpx;
  font-weight: 900;
  color: var(--primary);
}

.cal-unit {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.chevron-icon {
  color: var(--outline-variant);
  font-size: 48rpx;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

.stats-card {
  border-radius: var(--radius-default);
  padding: 48rpx;
}

.stats-card.full-width {
  grid-column: span 2;
  background-color: var(--primary-container);
  color: #ffffff;
}

.stats-card.full-width .stats-label {
  font-size: 24rpx;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
  margin-bottom: 16rpx;
}

.stats-card.full-width .stats-value-group {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.stats-card.full-width .stats-value {
  font-size: 72rpx;
  font-weight: 900;
  color: #ffffff;
}

.stats-card.full-width .stats-unit {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
  color: #ffffff;
}

.stats-card.square {
  background-color: var(--surface-container-low);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1 / 1;
}

.stats-icon {
  font-size: 60rpx;
}

.secondary-icon {
  color: var(--secondary);
}

.primary-icon {
  color: var(--primary);
}

.stats-card.square .stats-label {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-card.square .stats-value.small {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-top: 8rpx;
}
</style>
