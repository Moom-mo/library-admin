<script setup>
import { ref, onMounted, watch } from 'vue'
import { Download, TrendCharts, User, Clock, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { reportAPI } from '../api/index.js'

const timeRange = ref('weekly')
const trendType = ref('weekly')

const trendChart = ref(null)
const distributionChart = ref(null)
const floorChart = ref(null)
const peakChart = ref(null)

let trendChartInstance, distributionChartInstance, floorChartInstance, peakChartInstance

// 初始化图表
const initCharts = async () => {
  await initTrendChart()
  await initDistributionChart()
  await initFloorChart()
  await initPeakChart()
}

// 使用趋势图表
const initTrendChart = async () => {
  trendChartInstance = echarts.init(trendChart.value)
  
  const response = await reportAPI.getUsageTrend(trendType.value)
  if (response.code === 200) {
    const data = response.data
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.time || item.day)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '使用率',
          type: 'line',
          data: data.map(item => item.usage),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          }
        }
      ]
    }
    
    trendChartInstance.setOption(option)
  }
}

// 区域分布图表
const initDistributionChart = async () => {
  distributionChartInstance = echarts.init(distributionChart.value)
  
  const response = await reportAPI.getAreaDistribution()
  if (response.code === 200) {
    const data = response.data
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          name: '区域分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          data: data
        }
      ]
    }
    
    distributionChartInstance.setOption(option)
  }
}

// 楼层使用图表
const initFloorChart = async () => {
  floorChartInstance = echarts.init(floorChart.value)
  
  const response = await reportAPI.getFloorUsage()
  if (response.code === 200) {
    const data = response.data
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: data.map(item => item.floor)
      },
      series: [
        {
          name: '使用率',
          type: 'bar',
          data: data.map(item => item.rate),
          itemStyle: {
            color: function(params) {
              const colorList = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
              return colorList[params.dataIndex] || '#3b82f6'
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        }
      ]
    }
    
    floorChartInstance.setOption(option)
  }
}

// 高峰时段图表
const initPeakChart = async () => {
  peakChartInstance = echarts.init(peakChart.value)
  
  const response = await reportAPI.getPeakHours()
  if (response.code === 200) {
    const data = response.data
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.hour)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '使用率',
          type: 'bar',
          data: data.map(item => item.usage),
          itemStyle: {
            color: function(params) {
              return params.data > 80 ? '#ef4444' : 
                     params.data > 60 ? '#f59e0b' : '#10b981'
            }
          }
        }
      ]
    }
    
    peakChartInstance.setOption(option)
  }
}

// 导出报表
const handleExport = () => {
  ElMessage.success('报表导出功能开发中...')
}

// 监听趋势类型变化
watch(trendType, () => {
  initTrendChart()
})

// 页面加载时初始化
onMounted(() => {
  initCharts()
  
  // 响应式调整
  window.addEventListener('resize', () => {
    trendChartInstance?.resize()
    distributionChartInstance?.resize()
    floorChartInstance?.resize()
    peakChartInstance?.resize()
  })
})
</script>

<style scoped>
.data-report {
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

.stats-overview {
  margin-bottom: 24px;
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
  font-size: 24px;
  font-weight: 700;
  margin: 4px 0 0 0;
}

.stat-change {
  font-size: 12px;
  margin: 2px 0 0 0;
}

.stat-change.positive {
  color: #10b981;
}

.charts-container {
  margin-top: 24px;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e40af;
}

.chart {
  width: 100%;
}
</style>

<template>
  <div class="data-report">
    <div class="page-header">
      <h2 class="page-title">数据报表</h2>
      <div class="action-buttons">
        <el-button type="primary" :icon="Download" @click="handleExport">导出报表</el-button>
        <el-select v-model="timeRange" placeholder="选择时间范围" style="width: 150px">
          <el-option label="今日" value="daily" />
          <el-option label="本周" value="weekly" />
          <el-option label="本月" value="monthly" />
        </el-select>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon bg-blue-100">
                <el-icon class="text-blue-600"><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">平均使用率</p>
                <p class="stat-value">78%</p>
                <p class="stat-change positive">↑ 5.2%</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon bg-green-100">
                <el-icon class="text-green-600"><User /></el-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">日均活跃</p>
                <p class="stat-value">856</p>
                <p class="stat-change positive">↑ 12.3%</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon bg-orange-100">
                <el-icon class="text-orange-600"><Clock /></el-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">高峰时段</p>
                <p class="stat-value">14:00-16:00</p>
                <p class="stat-change">92% 使用率</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon bg-purple-100">
                <el-icon class="text-purple-600"><Location /></el-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">最受欢迎区域</p>
                <p class="stat-value">窗边座位</p>
                <p class="stat-change">95% 使用率</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20">
        <!-- 使用趋势 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>座位使用率趋势</h3>
                <el-radio-group v-model="trendType" size="small">
                  <el-radio-button label="daily">日趋势</el-radio-button>
                  <el-radio-button label="weekly">周趋势</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="trendChart" class="chart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 区域分布 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>区域使用分布</h3>
            </template>
            <div ref="distributionChart" class="chart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 楼层使用情况 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>楼层使用情况</h3>
            </template>
            <div ref="floorChart" class="chart" style="height: 300px;"></div>
          </el-card>
        </el-col>

        <!-- 高峰时段 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>高峰时段分析</h3>
            </template>
            <div ref="peakChart" class="chart" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>