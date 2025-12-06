// 座位相关Mock数据
export const seatList = [
  {
    id: 'A101',
    location: '1层-东区-窗边',
    floor: '1F',
    area: 'window',
    hasPower: true,
    hasLamp: true,
    hasPartition: false,
    status: 'available',
    currentUser: null,
    createdAt: '2024-01-01'
  },
  {
    id: 'B205',
    location: '2层-南区-讨论区',
    floor: '2F',
    area: 'discussion',
    hasPower: false,
    hasLamp: false,
    hasPartition: true,
    status: 'occupied',
    currentUser: '2021001',
    createdAt: '2024-01-01'
  },
  {
    id: 'C302',
    location: '3层-西区-安静区',
    floor: '3F',
    area: 'quiet',
    hasPower: true,
    hasLamp: false,
    hasPartition: false,
    status: 'temporary',
    currentUser: '2021002',
    createdAt: '2024-01-01'
  }
]

export const seatStats = {
  total: 386,
  available: 148,
  occupied: 205,
  temporary: 33,
  usageRate: 78
}