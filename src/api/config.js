// 区分开发/生产环境（Vite环境变量）
const isDevelopment = import.meta.env.DEV

/**
 * API基础路径配置
 * - 开发环境：使用Vite代理（避免跨域）
 * - 生产环境：真实后端接口地址
 */
export const API_BASE_URL = isDevelopment 
  ? '/api'  // 开发环境代理路径（需在vite.config.js配置代理）
  : 'https://library-admin-api.prod.com'  // 生产环境真实API地址

/**
 * 信用分全局常量配置（统一管理，便于维护）
 * 所有涉及信用分的逻辑均使用此常量，避免硬编码
 */
export const CREDIT_CONFIG = {
  MIN_SCORE: 0,          // 最低信用分
  MAX_SCORE: 100,        // 最高信用分
  NORMAL_THRESHOLD: 80,  // 正常状态阈值（≥80）
  WARNING_THRESHOLD: 60, // 警告状态阈值（≥60）
  BANNED_THRESHOLD: 60   // 封禁状态阈值（<60）
}

/**
 * 状态常量映射（全局统一）
 */
export const STATUS_MAP = {
  NORMAL: 'normal',
  WARNING: 'warning',
  BANNED: 'banned'
}