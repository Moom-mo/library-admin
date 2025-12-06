// 未处理反馈模拟数据
export const pendingFeedbackMock = {
  code: 200,
  msg: 'success',
  data: {
    list: [
      {
        id: 'FB001',
        userId: 'U001',
        username: '张三',
        content: '图书馆A区的座位电源接触不良，经常断电，希望尽快维修',
        contact: 'zhangsan@example.com',
        createTime: '2025-11-20 09:30:00',
        status: 'pending'
      },
      {
        id: 'FB002',
        userId: 'U002',
        username: '李四',
        content: '建议在图书馆2楼增加更多静音座位，目前静音区座位太少',
        contact: 'lisi@example.com',
        createTime: '2025-11-21 14:20:00',
        status: 'pending'
      },
      {
        id: 'FB003',
        userId: 'U003',
        username: '王五',
        content: '图书馆的预约系统偶尔卡顿，预约成功后显示无座位，希望优化',
        contact: 'wangwu@example.com',
        createTime: '2025-11-22 10:15:00',
        status: 'pending'
      }
    ],
    total: 3
  }
}

// 已处理反馈模拟数据
export const processedFeedbackMock = {
  code: 200,
  msg: 'success',
  data: {
    list: [
      {
        id: 'FB004',
        userId: 'U004',
        username: '赵六',
        content: '图书馆3楼的空调温度太低，长时间学习容易感冒',
        contact: 'zhaoliu@example.com',
        createTime: '2025-11-18 16:40:00',
        status: 'processed',
        replyContent: '已联系物业调整3楼空调温度至25℃，后续会定期巡检温度情况',
        processTime: '2025-11-19 10:05:00'
      },
      {
        id: 'FB005',
        userId: 'U005',
        username: '钱七',
        content: '图书馆借阅机无法识别校园卡，多次尝试都失败',
        contact: 'qianqi@example.com',
        createTime: '2025-11-19 09:10:00',
        status: 'processed',
        replyContent: '借阅机读卡器已维修完成，目前可正常使用，如有问题可联系技术部：010-12345678',
        processTime: '2025-11-19 15:30:00'
      }
    ],
    total: 2
  }
}

// 处理反馈后的返回数据（模拟接口更新成功）
export const updateFeedbackMock = {
  code: 200,
  msg: '反馈处理成功',
  data: null
}