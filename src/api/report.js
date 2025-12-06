import { usageTrendData, areaDistribution, floorUsage, peakHours } from './mock/reportData.js'

// 报表数据API接口
export const reportAPI = {
  // 获取使用趋势数据
  getUsageTrend: (type = 'daily') => {
    console.log('API调用: getUsageTrend', type)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = usageTrendData[type] || usageTrendData.daily
        resolve({
          code: 200,
          data: data,
          message: 'success'
        })
      }, 400)
    })
  },
  
  // 获取区域分布数据
  getAreaDistribution: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: areaDistribution,
          message: 'success'
        })
      }, 300)
    })
  },
  
  // 获取楼层使用数据
  getFloorUsage: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: floorUsage,
          message: 'success'
        })
      }, 300)
    })
  },
  
  // 获取高峰时段数据
  getPeakHours: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: peakHours,
          message: 'success'
        })
      }, 300)
    })
  },
  
  // 获取综合报表数据
  getComprehensiveReport: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            usageTrend: usageTrendData.weekly,
            areaDistribution,
            floorUsage,
            peakHours
          },
          message: 'success'
        })
      }, 600)
    })
  }
}