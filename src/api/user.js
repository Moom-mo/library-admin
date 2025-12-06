import request from '@/utils/request'
import { API_BASE_URL, CREDIT_CONFIG } from './config'

// 模拟用户数据（实际项目中删除，使用真实接口）
const userList = [
  {
    id: '1',
    studentId: '2021001',
    name: '张三',
    college: '计算机学院',
    major: '软件工程',
    creditScore: 90,
    status: 'normal',
    currentSeat: 'A101',
    lastLogin: '2025-11-20 08:30:00'
  },
  {
    id: '2',
    studentId: '2021002',
    name: '李四',
    college: '电子信息学院',
    major: '通信工程',
    creditScore: 70,
    status: 'warning',
    currentSeat: 'B203',
    lastLogin: '2025-11-19 16:45:00'
  },
  {
    id: '3',
    studentId: '2021003',
    name: '王五',
    college: '管理学院',
    major: '工商管理',
    creditScore: 50,
    status: 'banned',
    currentSeat: '',
    lastLogin: '2025-11-18 10:20:00'
  },
  {
    id: '4',
    studentId: '2021004',
    name: '赵六',
    college: '计算机学院',
    major: '人工智能',
    creditScore: 85,
    status: 'normal',
    currentSeat: 'A102',
    lastLogin: '2025-11-20 09:15:00'
  },
  {
    id: '5',
    studentId: '2021005',
    name: '孙七',
    college: '电子信息学院',
    major: '电子工程',
    creditScore: 58,
    status: 'banned',
    currentSeat: '',
    lastLogin: '2025-11-17 14:30:00'
  }
]

export const userAPI = {
  // 获取用户列表（支持筛选、搜索）
  getUserList: (params) => {
    // 模拟接口请求（实际项目替换为真实接口）
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟筛选逻辑
        const filtered = userList.filter(user => {
          const matchesStatus = !params.status || user.status === params.status
          const matchesCollege = !params.college || user.college === params.college
          const matchesKeyword = !params.keyword || 
            user.name.includes(params.keyword) || 
            user.studentId.includes(params.keyword)
          return matchesStatus && matchesCollege && matchesKeyword
        })

        // 模拟分页（实际项目中由后端处理）
        const startIndex = (params.page - 1) * params.pageSize
        const paginated = filtered.slice(startIndex, startIndex + params.pageSize)

        resolve({
          code: 200,
          data: {
            list: paginated,
            total: filtered.length
          },
          message: 'success'
        })
      }, 500)
    })

    // 真实接口请求（取消注释即可使用）
    // return request({
    //   url: `${API_BASE_URL}/user/list`,
    //   method: 'get',
    //   params
    // })
  },

  // 获取用户统计数据
  getUserStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: userList.length,
          normal: userList.filter(u => u.status === 'normal').length,
          warning: userList.filter(u => u.status === 'warning').length,
          banned: userList.filter(u => u.status === 'banned').length
        }
        resolve({
          code: 200,
          data: stats,
          message: 'success'
        })
      }, 500)
    })

    // 真实接口请求（取消注释即可使用）
    // return request({
    //   url: `${API_BASE_URL}/user/stats`,
    //   method: 'get'
    // })
  },

  // 核心接口：更新用户信用分（信用分管理核心）
  updateCreditScore: (userId, score) => {
    console.log('API调用: 更新用户信用分', { userId, score })
    return new Promise((resolve) => {
      setTimeout(() => {
        // 查找目标用户
        const user = userList.find(item => item.id === userId)
        if (!user) {
          return resolve({
            code: 404,
            message: '用户不存在'
          })
        }

        // 保存原信用分（用于日志记录，实际项目中存储到数据库）
        const oldScore = user.creditScore
        
        // 更新信用分并联动用户状态（核心逻辑）
        user.creditScore = score
        if (score >= CREDIT_CONFIG.NORMAL_THRESHOLD) {
          user.status = 'normal' // 80+ → 正常
        } else if (score >= CREDIT_CONFIG.WARNING_THRESHOLD) {
          user.status = 'warning' // 60-79 → 警告
        } else {
          user.status = 'banned' // <60 → 封禁
          user.currentSeat = '' // 封禁时清空座位
        }

        resolve({
          code: 200,
          data: {
            ...user,
            oldScore // 返回原分数，便于前端展示变动
          },
          message: '信用分更新成功'
        })
      }, 500)
    })

    // 真实接口请求（取消注释即可使用）
    // return request({
    //   url: `${API_BASE_URL}/user/${userId}/credit`,
    //   method: 'put',
    //   data: { score }
    // })
  },

  // 辅助接口：切换用户状态（封禁/解封）
  toggleUserStatus: (userId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = userList.find(item => item.id === userId)
        if (!user) {
          return resolve({
            code: 404,
            message: '用户不存在'
          })
        }

        // 切换状态时同步调整信用分（联动逻辑）
        if (status === 'banned' && user.creditScore >= CREDIT_CONFIG.BANNED_THRESHOLD) {
          user.creditScore = CREDIT_CONFIG.BANNED_THRESHOLD - 1 // 封禁时信用分设为59
        } else if (status === 'normal' && user.creditScore < CREDIT_CONFIG.WARNING_THRESHOLD) {
          user.creditScore = CREDIT_CONFIG.WARNING_THRESHOLD // 解封时信用分设为60
        }

        user.status = status
        if (status === 'banned') user.currentSeat = '' // 封禁时清空座位

        resolve({
          code: 200,
          data: user,
          message: `用户已${status === 'banned' ? '封禁' : '解封'}`
        })
      }, 500)
    })

    // 真实接口请求（取消注释即可使用）
    // return request({
    //   url: `${API_BASE_URL}/user/${userId}/status`,
    //   method: 'put',
    //   data: { status }
    // })
  }
}