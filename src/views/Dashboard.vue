<template>
  <div class="dashboard">
    <h2 class="page-title">系统概览</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-blue-100">
            <el-icon class="text-blue-600"><Position /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">总座位数</p>
            <p class="stat-value">386</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-green-100">
            <el-icon class="text-green-600"><DataLine /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">当前使用率</p>
            <p class="stat-value">78%</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-yellow-100">
            <el-icon class="text-yellow-600"><User /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">今日活跃用户</p>
            <p class="stat-value">243</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-red-100">
            <el-icon class="text-red-600"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">待处理事务</p>
            <p class="stat-value">12</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <el-card class="chart-card">
        <template #header>
          <h3 class="chart-title">座位使用率趋势</h3>
        </template>
        <div ref="usageChart" class="chart-container"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <h3 class="chart-title">区域使用分布</h3>
        </template>
        <div ref="distributionChart" class="chart-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Position, DataLine, User, Warning } from '@element-plus/icons-vue'

const usageChart = ref(null)
const distributionChart = ref(null)

onMounted(() => {
  initCharts()
})

const initCharts = () => {
  // 使用率趋势图表
  const usageChartInstance = echarts.init(usageChart.value)
  usageChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总体使用率', '窗边座位'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '总体使用率',
        type: 'line',
        data: [65, 72, 81, 78, 89, 63, 75],
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: '窗边座位',
        type: 'line',
        data: [85, 80, 92, 88, 95, 78, 89],
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#10b981' }
      }
    ]
  })

  // 使用分布图表
  const distributionChartInstance = echarts.init(distributionChart.value)
  distributionChartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        name: '区域分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          { value: 35, name: '安静区', itemStyle: { color: '#1e40af' } },
          { value: 25, name: '讨论区', itemStyle: { color: '#3b82f6' } },
          { value: 20, name: '窗边座位', itemStyle: { color: '#10b981' } },
          { value: 15, name: '电源专区', itemStyle: { color: '#f59e0b' } },
          { value: 5, name: 'VIP区', itemStyle: { color: '#ef4444' } }
        ]
      }
    ]
  })

  // 响应式调整图表大小
  window.addEventListener('resize', () => {
    usageChartInstance.resize()
    distributionChartInstance.resize()
  })
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .el-icon {
  font-size: 28px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.stat-value {
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin: 4px 0 0 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.chart-container {
  height: 320px;
  width: 100%;
}
</style>