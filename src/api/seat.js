import { seatList, seatStats } from './mock/seatData.js'

// 座位管理API接口
export const seatAPI = {
  // 获取座位列表
  getSeatList: (params = {}) => {
    console.log('API调用: getSeatList', params)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...seatList]
        
        // 模拟筛选
        if (params.floor) {
          data = data.filter(item => item.floor === params.floor)
        }
        if (params.area) {
          data = data.filter(item => item.area === params.area)
        }
        if (params.status) {
          data = data.filter(item => item.status === params.status)
        }
        
        resolve({
          code: 200,
          data: {
            list: data,
            total: data.length,
            page: params.page || 1,
            pageSize: params.pageSize || 10
          },
          message: 'success'
        })
      }, 500)
    })
  },
  
  // 获取座位统计
  getSeatStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: seatStats,
          message: 'success'
        })
      }, 300)
    })
  },
  
  // 添加座位
  addSeat: (seatData) => {
    console.log('API调用: addSeat', seatData)
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSeat = {
          id: `S${Date.now()}`,
          ...seatData,
          createdAt: new Date().toISOString()
        }
        seatList.push(newSeat)
        resolve({
          code: 200,
          data: newSeat,
          message: '添加成功'
        })
      }, 500)
    })
  },
  
  // 删除座位
  deleteSeat: (seatId) => {
    console.log('API调用: deleteSeat', seatId)
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = seatList.findIndex(item => item.id === seatId)
        if (index > -1) {
          seatList.splice(index, 1)
          resolve({
            code: 200,
            message: '删除成功'
          })
        } else {
          resolve({
            code: 404,
            message: '座位不存在'
          })
        }
      }, 500)
    })
  }
}