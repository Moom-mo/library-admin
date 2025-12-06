<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Refresh, FullScreen, Clock, DataLine, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { seatAPI } from '../api/index.js'

const currentFloor = ref('1F')
const hoverArea = ref('')
const hoverSeat = ref(null)
const selectedSeat = ref(null)
const seatDetailVisible = ref(false)

const floorStats = ref({
  total: 0,
  available: 0,
  occupied: 0,
  usageRate: 0
})

const lastUpdateTime = ref('')
const onlineUsers = ref(0)
const currentUsageRate = ref(0)
const availableSeats = ref(0)
const occupiedSeats = ref(0)

// 模拟座位数据
const quietSeats = ref([
  { id: 'A101', status: 'available', hasPower: true, hasLamp: true, location: '1F-安静区-01', floor: '1F' },
  { id: 'A102', status: 'occupied', hasPower: true, hasLamp: false, location: '1F-安静区-02', floor: '1F', currentUser: '2021001', currentUserName: '张三', occupiedSince: '14:30' },
  { id: 'A103', status: 'available', hasPower: false, hasLamp: true, location: '1F-安静区-03', floor: '1F' },
  { id: 'A104', status: 'temporary', hasPower: true, hasLamp: true, location: '1F-安静区-04', floor: '1F', currentUser: '2021002', occupiedSince: '15:00' }
])

const discussionSeats = ref([
  { id: 'B201', status: 'occupied', hasPower: false, hasLamp: false, location: '1F-讨论区-01', floor: '1F', currentUser: '2021003', occupiedSince: '13:45' },
  { id: 'B202', status: 'occupied', hasPower: true, hasLamp: false, location: '1F-讨论区-02', floor: '1F', currentUser: '2021004', occupiedSince: '14:15' },
  { id: 'B203', status: 'available', hasPower: false, hasLamp: false, location: '1F-讨论区-03', floor: '1F' }
])

const windowSeats = ref([
  { id: 'C301', status: 'occupied', hasPower: true, hasLamp: true, location: '1F-窗边-01', floor: '1F', currentUser: '2021005', occupiedSince: '10:30' },
  { id: 'C302', status: 'occupied', hasPower: true, hasLamp: true, location: '1F-窗边-02', floor: '1F', currentUser: '2021006', occupiedSince: '11:00' },
  { id: 'C303', status: 'reserved', hasPower: true, hasLamp: true, location: '1F-窗边-03', floor: '1F' },
  { id: 'C304', status: 'available', hasPower: true, hasLamp: false, location: '1F-窗边-04', floor: '1F' }
])

const alerts = ref([
  { id: 1, level: 'warning', message: '座位B205暂离超时', time: '15:20' },
  { id: 2, level: 'info', message: '座位A101设备报修', time: '14:55' }
])

// 计算统计数据
const updateStats = () => {
  const allSeats = [...quietSeats.value, ...discussionSeats.value, ...windowSeats.value]
  floorStats.value.total = allSeats.length
  floorStats.value.available = allSeats.filter(seat => seat.status === 'available').length
  floorStats.value.occupied = allSeats.filter(seat => ['occupied', 'temporary'].includes(seat.status)).length
  floorStats.value.usageRate = Math.round((floorStats.value.occupied / floorStats.value.total) * 100)
  
  availableSeats.value = floorStats.value.available
  occupiedSeats.value = floorStats.value.occupied
  currentUsageRate.value = floorStats.value.usageRate
  onlineUsers.value = allSeats.filter(seat => seat.status === 'occupied').length
}

// 切换楼层
const switchFloor = () => {
  // 在实际应用中，这里会调用API获取对应楼层的座位数据
  ElMessage.info(`切换到${currentFloor.value}`)
  updateStats()
}

// 获取座位样式类
const getSeatClass = (seat) => {
  return {
    'available': seat.status === 'available',
    'occupied': seat.status === 'occupied',
    'temporary': seat.status === 'temporary',
    'reserved': seat.status === 'reserved',
    'has-power': seat.hasPower,
    'has-lamp': seat.hasLamp
  }
}

// 选择座位
const selectSeat = (seat) => {
  selectedSeat.value = seat
  seatDetailVisible.value = true
}

// 强制释放座位
const forceRelease = async (seat) => {
  try {
    await ElMessageBox.confirm(`确定要强制释放座位 ${seat.id} 吗？`, '提示', {
      type: 'warning'
    })
    
    seat.status = 'available'
    seat.currentUser = null
    seat.occupiedSince = null
    updateStats()
    ElMessage.success('座位已释放')
    seatDetailVisible.value = false
  } catch (error) {
    // 用户取消操作
  }
}

// 刷新数据
const refreshData = () => {
  lastUpdateTime.value = new Date().toLocaleTimeString()
  updateStats()
  ElMessage.success('数据已刷新')
}

// 全屏查看
const toggleFullscreen = () => {
  ElMessage.info('全屏功能开发中...')
}

// 获取使用率颜色
const getUsageColor = (rate) => {
  if (rate < 60) return '#10b981'
  if (rate < 80) return '#f59e0b'
  return '#ef4444'
}

// 获取告警颜色
const getAlertColor = (level) => {
  const colorMap = {
    'info': '#3b82f6',
    'warning': '#f59e0b',
    'error': '#ef4444'
  }
  return colorMap[level] || '#6b7280'
}

const getStatusType = (status) => {
  const statusMap = {
    'available': 'success',
    'occupied': 'danger',
    'temporary': 'warning',
    'reserved': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'available': '可用',
    'occupied': '使用中', 
    'temporary': '暂离',
    'reserved': '已预约'
  }
  return statusMap[status] || '未知'
}

// 模拟实时更新
let updateInterval
onMounted(() => {
  updateStats()
  lastUpdateTime.value = new Date().toLocaleTimeString()
  
  // 每30秒自动更新一次
  updateInterval = setInterval(() => {
    refreshData()
  }, 30000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.real-time-monitor {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.floor-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.floor-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #6b7280;
}

.library-map {
  margin-bottom: 24px;
}

.map-container {
  border-radius: 12px;
}

.map-content {
  display: flex;
  gap: 24px;
  min-height: 500px;
}

.floor-plan {
  flex: 1;
  display: grid;
  grid-template-areas: 
    "quiet discussion"
    "window window";
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.area {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.area.highlight {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.area h4 {
  margin: 0 0 12px 0;
  color: #1e40af;
  font-size: 16px;
}

.quiet-area {
  grid-area: quiet;
}

.discussion-area {
  grid-area: discussion;
}

.window-area {
  grid-area: window;
}

.seats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.seats-row {
  display: flex;
  gap: 8px;
  justify-content: space-around;
}

.seat {
  width: 60px;
  height: 60px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-size: 12px;
  font-weight: 600;
}

.seat:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.seat.available {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.seat.occupied {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.seat.temporary {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.seat.reserved {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.seat.has-power::after {
  content: '⚡';
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
}

.map-legend {
  width: 200px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.map-legend h4 {
  margin: 0 0 12px 0;
  color: #1e40af;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.color-box.available {
  background: #10b981;
}

.color-box.occupied {
  background: #ef4444;
}

.color-box.temporary {
  background: #f59e0b;
}

.color-box.reserved {
  background: #3b82f6;
}

.seat-detail {
  padding: 8px 0;
}

.seat-actions {
  margin-top: 16px;
  text-align: center;
}

.facilities {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.realtime-panel {
  margin-top: 24px;
}

.panel-card {
  border-radius: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e40af;
}

.panel-content {
  padding: 8px 0;
}

.status-item, .stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stats-progress {
  width: 100%;
}

.stats-progress .label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.stat {
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.alert-list {
  max-height: 120px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-message {
  flex: 1;
  font-size: 14px;
}

.alert-time {
  font-size: 12px;
  color: #9ca3af;
}

.no-alerts {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 20px 0;
}
</style>

<template>
  <div class="real-time-monitor">
    <div class="page-header">
      <h2 class="page-title">实时监控地图</h2>
      <div class="action-buttons">
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-button :icon="FullScreen" @click="toggleFullscreen">全屏查看</el-button>
      </div>
    </div>

    <!-- 楼层选择 -->
    <div class="floor-selector">
      <el-radio-group v-model="currentFloor" @change="switchFloor">
        <el-radio-button label="1F">一楼</el-radio-button>
        <el-radio-button label="2F">二楼</el-radio-button>
        <el-radio-button label="3F">三楼</el-radio-button>
      </el-radio-group>
      <div class="floor-stats">
        <span>总座位: {{ floorStats.total }}</span>
        <span>可用: {{ floorStats.available }}</span>
        <span>使用中: {{ floorStats.occupied }}</span>
        <span>使用率: {{ floorStats.usageRate }}%</span>
      </div>
    </div>

    <!-- 图书馆地图 -->
    <div class="library-map">
      <el-card class="map-container">
        <div class="map-content">
          <!-- 模拟图书馆平面图 -->
          <div class="floor-plan">
            <div class="area quiet-area" :class="{ 'highlight': hoverArea === 'quiet' }">
              <h4>安静区</h4>
              <div class="seats-grid">
                <div v-for="seat in quietSeats" 
                     :key="seat.id"
                     class="seat"
                     :class="getSeatClass(seat)"
                     @mouseenter="hoverSeat = seat"
                     @mouseleave="hoverSeat = null"
                     @click="selectSeat(seat)">
                  <span class="seat-id">{{ seat.id }}</span>
                </div>
              </div>
            </div>

            <div class="area discussion-area" :class="{ 'highlight': hoverArea === 'discussion' }">
              <h4>讨论区</h4>
              <div class="seats-grid">
                <div v-for="seat in discussionSeats" 
                     :key="seat.id"
                     class="seat"
                     :class="getSeatClass(seat)"
                     @mouseenter="hoverSeat = seat"
                     @mouseleave="hoverSeat = null"
                     @click="selectSeat(seat)">
                  <span class="seat-id">{{ seat.id }}</span>
                </div>
              </div>
            </div>

            <div class="area window-area" :class="{ 'highlight': hoverArea === 'window' }">
              <h4>窗边座位</h4>
              <div class="seats-row">
                <div v-for="seat in windowSeats" 
                     :key="seat.id"
                     class="seat"
                     :class="getSeatClass(seat)"
                     @mouseenter="hoverSeat = seat"
                     @mouseleave="hoverSeat = null"
                     @click="selectSeat(seat)">
                  <span class="seat-id">{{ seat.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 图例 -->
          <div class="map-legend">
            <h4>图例</h4>
            <div class="legend-items">
              <div class="legend-item">
                <div class="color-box available"></div>
                <span>可用</span>
              </div>
              <div class="legend-item">
                <div class="color-box occupied"></div>
                <span>使用中</span>
              </div>
              <div class="legend-item">
                <div class="color-box temporary"></div>
                <span>暂离</span>
              </div>
              <div class="legend-item">
                <div class="color-box reserved"></div>
                <span>已预约</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 座位详情 -->
    <el-dialog v-model="seatDetailVisible" :title="`座位详情 - ${selectedSeat?.id}`" width="500px">
      <div v-if="selectedSeat" class="seat-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="座位编号">{{ selectedSeat.id }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ selectedSeat.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedSeat.status)" effect="light">
              {{ getStatusText(selectedSeat.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="楼层">{{ selectedSeat.floor }}</el-descriptions-item>
          <el-descriptions-item label="设施" :span="2">
            <div class="facilities">
              <el-tag v-if="selectedSeat.hasPower" size="small" type="success">电源</el-tag>
              <el-tag v-if="selectedSeat.hasLamp" size="small" type="primary">台灯</el-tag>
              <el-tag v-if="selectedSeat.hasPartition" size="small" type="info">隔音</el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedSeat.currentUser" label="当前用户" :span="2">
            {{ selectedSeat.currentUserName }} ({{ selectedSeat.currentUser }})
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedSeat.occupiedSince" label="开始使用时间" :span="2">
            {{ selectedSeat.occupiedSince }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="seat-actions" v-if="selectedSeat.status === 'occupied'">
          <el-button type="warning" @click="forceRelease(selectedSeat)">强制释放</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 实时数据面板 -->
    <div class="realtime-panel">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="panel-card">
            <template #header>
              <div class="panel-header">
                <el-icon><Clock /></el-icon>
                <span>实时状态</span>
              </div>
            </template>
            <div class="panel-content">
              <div class="status-item">
                <span class="label">最后更新:</span>
                <span class="value">{{ lastUpdateTime }}</span>
              </div>
              <div class="status-item">
                <span class="label">在线用户:</span>
                <span class="value">{{ onlineUsers }}</span>
              </div>
              <div class="status-item">
                <span class="label">系统状态:</span>
                <el-tag type="success" size="small">正常运行</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="panel-card">
            <template #header>
              <div class="panel-header">
                <el-icon><DataLine /></el-icon>
                <span>使用统计</span>
              </div>
            </template>
            <div class="panel-content">
              <div class="stats-item">
                <div class="stats-progress">
                  <span class="label">当前使用率</span>
                  <el-progress :percentage="currentUsageRate" :color="getUsageColor(currentUsageRate)" />
                </div>
              </div>
              <div class="stats-grid">
                <div class="stat">
                  <div class="stat-value">{{ availableSeats }}</div>
                  <div class="stat-label">可用座位</div>
                </div>
                <div class="stat">
                  <div class="stat-value">{{ occupiedSeats }}</div>
                  <div class="stat-label">使用中</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="panel-card">
            <template #header>
              <div class="panel-header">
                <el-icon><Warning /></el-icon>
                <span>异常监控</span>
              </div>
            </template>
            <div class="panel-content">
              <div class="alert-list">
                <div v-for="alert in alerts" :key="alert.id" class="alert-item">
                  <el-icon :color="getAlertColor(alert.level)"><Warning /></el-icon>
                  <span class="alert-message">{{ alert.message }}</span>
                  <span class="alert-time">{{ alert.time }}</span>
                </div>
                <div v-if="alerts.length === 0" class="no-alerts">
                  暂无异常
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>