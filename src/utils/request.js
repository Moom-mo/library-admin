import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { API_BASE_URL } from '@/api/config.js'

// 创建axios实例
const service = axios.create({
  baseURL: API_BASE_URL,  // 基础路径（从config.js导入）
  timeout: 8000,          // 请求超时时间（8秒）
  headers: {
    'Content-Type': 'application/json;charset=utf-8' // 默认请求头
  }
})

// 加载动画实例
let loadingInstance = null

// 请求拦截器：添加加载动画和认证Token
service.interceptors.request.use(
  (config) => {
    // 显示加载动画（全局统一加载状态）
    loadingInstance = ElLoading.service({
      lock: false,
      text: '处理中...',
      background: 'rgba(255, 255, 255, 0.7)'
    })

    // 从本地存储获取管理员Token（实际项目根据登录逻辑调整）
    const adminToken = localStorage.getItem('library_admin_token')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}` // Token放入请求头
    }
    return config
  },
  (error) => {
    // 请求发送失败：关闭加载动画并提示错误
    if (loadingInstance) loadingInstance.close()
    console.error('请求发送失败:', error)
    ElMessage.error('请求失败，请检查网络连接')
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理返回结果和错误
service.interceptors.response.use(
  (response) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()

    const res = response.data
    // 业务成功（code=200）：直接返回数据
    if (res.code === 200) {
      return res
    } else {
      // 业务错误（非200状态码）：提示错误信息
      ElMessage.error(res.message || '操作失败')
      return Promise.reject(res)
    }
  },
  (error) => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close()

    // 网络错误处理
    console.error('网络请求错误:', error)
    if (error.message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后重试')
    } else if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      // 跳转登录页（实际项目根据路由配置调整）
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } else if (error.response?.status === 403) {
      ElMessage.error('权限不足，无法操作')
    } else if (error.response?.status === 500) {
      ElMessage.error('服务器错误，请联系管理员')
    } else {
      ElMessage.error('网络异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default service