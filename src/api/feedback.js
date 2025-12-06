import request from '@/utils/request'

/**
 * 获取用户反馈列表
 * @param {Object} params - 查询参数
 * @param {string} [params.keyword] - 搜索关键词（反馈内容/用户名）
 * @param {string} [params.status] - 状态筛选（pending-未处理，processed-已处理）
 * @param {number} [params.pageNum=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise} - 接口响应Promise
 */
export const getFeedbackList = (params) => {
  return request({
    url: '/library/feedback/list',
    method: 'get',
    params
  })
}

/**
 * 更新反馈处理状态
 * @param {string} id - 反馈ID
 * @param {Object} data - 处理数据
 * @param {string} data.status - 处理状态（pending:未处理，processed:已处理）
 * @param {string} data.replyContent - 回复内容
 * @param {string} [data.processTime] - 处理时间（后端自动生成也可）
 * @returns {Promise} - 接口响应Promise
 */
export const updateFeedbackStatus = (id, data) => {
  return request({
    url: `/library/feedback/${id}/status`,
    method: 'put',
    data
  })
}

/**
 * 获取反馈详情
 * @param {string} id - 反馈ID
 * @returns {Promise} - 接口响应Promise
 */
export const getFeedbackDetail = (id) => {
  return request({
    url: `/library/feedback/${id}`,
    method: 'get'
  })
}