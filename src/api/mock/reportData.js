// 报表相关Mock数据
export const usageTrendData = {
  daily: [
    { time: '08:00', usage: 25 },
    { time: '10:00', usage: 65 },
    { time: '12:00', usage: 45 },
    { time: '14:00', usage: 85 },
    { time: '16:00', usage: 92 },
    { time: '18:00', usage: 78 },
    { time: '20:00', usage: 60 }
  ],
  weekly: [
    { day: '周一', usage: 65 },
    { day: '周二', usage: 72 },
    { day: '周三', usage: 81 },
    { day: '周四', usage: 78 },
    { day: '周五', usage: 89 },
    { day: '周六', usage: 63 },
    { day: '周日', usage: 45 }
  ],
  monthly: [
    { week: '第1周', usage: 68 },
    { week: '第2周', usage: 75 },
    { week: '第3周', usage: 82 },
    { week: '第4周', usage: 79 }
  ]
}

export const areaDistribution = [
  { name: '安静区', value: 35, color: '#1e40af' },
  { name: '讨论区', value: 25, color: '#3b82f6' },
  { name: '窗边座位', value: 20, color: '#10b981' },
  { name: '电源专区', value: 15, color: '#f59e0b' },
  { name: 'VIP区', value: 5, color: '#ef4444' }
]

export const floorUsage = [
  { floor: '1楼', total: 120, used: 95, rate: 79 },
  { floor: '2楼', total: 150, used: 125, rate: 83 },
  { floor: '3楼', total: 116, used: 85, rate: 73 }
]

export const peakHours = [
  { hour: '08:00-10:00', usage: 65 },
  { hour: '10:00-12:00', usage: 85 },
  { hour: '12:00-14:00', usage: 45 },
  { hour: '14:00-16:00', usage: 92 },
  { hour: '16:00-18:00', usage: 88 },
  { hour: '18:00-20:00', usage: 75 },
  { hour: '20:00-22:00', usage: 60 }
]