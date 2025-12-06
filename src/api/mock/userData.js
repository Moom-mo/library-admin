// 用户相关Mock数据
export const userList = [
  {
    id: '2021001',
    name: '张三',
    studentId: '2021001001',
    college: '计算机学院',
    major: '软件工程',
    grade: '2021级',
    phone: '13800138001',
    email: 'zhangsan@edu.cn',
    creditScore: 95,
    status: 'normal', // normal, warning, banned
    totalUsage: 120,
    currentSeat: 'B205',
    lastLogin: '2024-01-15 14:30:00',
    registerTime: '2023-09-01',
    violationCount: 0
  },
  {
    id: '2021002',
    name: '李四',
    studentId: '2021002001',
    college: '电子信息学院',
    major: '通信工程',
    grade: '2021级',
    phone: '13800138002',
    email: 'lisi@edu.cn',
    creditScore: 78,
    status: 'warning',
    totalUsage: 85,
    currentSeat: null,
    lastLogin: '2024-01-14 10:15:00',
    registerTime: '2023-09-01',
    violationCount: 2
  },
  {
    id: '2021003',
    name: '王五',
    studentId: '2021003001',
    college: '管理学院',
    major: '工商管理',
    grade: '2021级',
    phone: '13800138003',
    email: 'wangwu@edu.cn',
    creditScore: 45,
    status: 'banned',
    totalUsage: 60,
    currentSeat: null,
    lastLogin: '2024-01-10 09:20:00',
    registerTime: '2023-09-01',
    violationCount: 5
  }
]

export const userStats = {
  total: 1250,
  active: 856,
  online: 243,
  warning: 45,
  banned: 12
}