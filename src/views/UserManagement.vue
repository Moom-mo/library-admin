<template>
  <div class="user-management">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="action-buttons">
        <el-button type="primary" :icon="Search">搜索用户</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-blue-100">
            <el-icon class="text-blue-600"><User /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">总用户数</p>
            <p class="stat-value">{{ userStats.total }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-green-100">
            <el-icon class="text-green-600"><Check /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">正常用户</p>
            <p class="stat-value">{{ userStats.normal }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-yellow-100">
            <el-icon class="text-yellow-600"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">警告用户</p>
            <p class="stat-value">{{ userStats.warning }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-red-100">
            <el-icon class="text-red-600"><Lock /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">封禁用户</p>
            <p class="stat-value">{{ userStats.banned }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/学号"
          :prefix-icon="Search"
          style="width: 300px"
          clearable
        />
        <el-select v-model="statusFilter" placeholder="所有状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="正常" value="normal" />
          <el-option label="警告" value="warning" />
          <el-option label="封禁" value="banned" />
        </el-select>
        <el-select v-model="collegeFilter" placeholder="所属学院" clearable>
          <el-option label="全部学院" value="" />
          <el-option label="计算机学院" value="计算机学院" />
          <el-option label="电子信息学院" value="电子信息学院" />
          <el-option label="管理学院" value="管理学院" />
        </el-select>
      </div>
    </el-card>

    <!-- 用户表格 -->
    <el-card class="table-card">
      <el-table :data="userData" v-loading="loading" style="width: 100%" border>
        <el-table-column prop="studentId" label="学号" width="120" align="center" />
        <el-table-column prop="name" label="姓名" width="100" align="center" />
        <el-table-column prop="college" label="学院" width="140" align="center" />
        <el-table-column prop="major" label="专业" width="140" align="center" />
        <!-- 信用分列（核心展示） -->
        <el-table-column label="信用分" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getCreditType(row.creditScore)" effect="light" size="medium">
              {{ row.creditScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light" size="medium">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentSeat" label="当前座位" width="120" align="center" />
        <el-table-column prop="lastLogin" label="最后登录" width="160" align="center" />
        <!-- 操作列（含信用分编辑按钮） -->
        <el-table-column label="操作" width="220" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleEditCredit(row)"
                icon="el-icon-edit"
              >
                信用分
              </el-button>
              <el-button 
                v-if="row.status !== 'banned'"
                type="warning" 
                size="small"
                @click="handleBanUser(row.id)"
                icon="el-icon-lock"
              >
                封禁
              </el-button>
              <el-button 
                v-else
                type="success" 
                size="small"
                @click="handleUnbanUser(row.id)"
                icon="el-icon-unlock"
              >
                解封
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <!-- 编辑信用分对话框（核心交互） -->
    <el-dialog v-model="creditDialogVisible" title="修改信用分" width="450px" center>
      <div class="credit-dialog">
        <p class="user-info">用户: {{ currentUser?.name }} (学号: {{ currentUser?.studentId }})</p>
        <div class="credit-rule">
          <h4>信用分规则说明</h4>
          <ul>
            <li>≥80分：正常状态，可正常预约座位</li>
            <li>60-79分：警告状态，预约次数受限</li>
            <li>&lt;60分：自动封禁，无法预约座位</li>
          </ul>
        </div>
        <el-slider
          v-model="creditScore"
          :min="CREDIT_CONFIG.MIN_SCORE"
          :max="CREDIT_CONFIG.MAX_SCORE"
          :marks="creditMarks"
          show-stops
          @input="handleCreditSliderChange"
          style="margin: 20px 0"
        />
        <div class="slider-value">当前信用分: <span class="score">{{ creditScore }}</span> 
          <span class="status-tip">{{ getCreditStatusTip(creditScore) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="creditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateCredit">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, User, Check, Warning, Lock, Edit } from '@element-plus/icons-vue'
import { userAPI } from '@/api/user.js'
import { CREDIT_CONFIG } from '@/api/config.js'

// 基础数据变量
const userData = ref([])
const userStats = ref({ total: 0, normal: 0, warning: 0, banned: 0 })
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选条件
const searchKeyword = ref('')
const statusFilter = ref('')
const collegeFilter = ref('')

// 信用分管理核心变量（新增/修改）
const creditDialogVisible = ref(false) // 对话框显示状态
const currentUser = ref(null) // 当前操作的用户
const creditScore = ref(0) // 信用分滑块值
const creditMarks = { // 滑块刻度
  [CREDIT_CONFIG.MIN_SCORE]: '0',
  [CREDIT_CONFIG.WARNING_THRESHOLD]: '60',
  [CREDIT_CONFIG.NORMAL_THRESHOLD]: '80',
  [CREDIT_CONFIG.MAX_SCORE]: '100'
}

// 获取用户列表（原有逻辑）
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value,
      college: collegeFilter.value,
      keyword: searchKeyword.value
    }
    const response = await userAPI.getUserList(params)
    if (response.code === 200) {
      userData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 获取用户统计数据（原有逻辑）
const fetchUserStats = async () => {
  try {
    const response = await userAPI.getUserStats()
    if (response.code === 200) {
      userStats.value = response.data
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 编辑信用分（新增逻辑）
const handleEditCredit = (user) => {
  currentUser.value = user
  creditScore.value = user.creditScore // 初始化滑块值为用户当前信用分
  creditDialogVisible.value = true
}

// 滑块变动时提示状态（新增逻辑）
const handleCreditSliderChange = (score) => {
  if (score < CREDIT_CONFIG.BANNED_THRESHOLD && currentUser.value?.status !== 'banned') {
    ElMessage.warning('信用分低于60分，用户将自动封禁')
  } else if (score >= CREDIT_CONFIG.NORMAL_THRESHOLD && currentUser.value?.status !== 'normal') {
    ElMessage.success('信用分达到80分，用户将恢复正常状态')
  } else if (score >= CREDIT_CONFIG.WARNING_THRESHOLD && score < CREDIT_CONFIG.NORMAL_THRESHOLD) {
    ElMessage.info('信用分处于警告区间，预约功能受限')
  }
}

// 获取信用分状态提示文本（新增逻辑）
const getCreditStatusTip = (score) => {
  if (score >= CREDIT_CONFIG.NORMAL_THRESHOLD) return '(正常状态)'
  if (score >= CREDIT_CONFIG.WARNING_THRESHOLD) return '(警告状态)'
  return '(封禁状态)'
}

// 更新信用分（核心逻辑，新增+原有优化）
const handleUpdateCredit = async () => {
  // 校验信用分范围
  if (creditScore.value < CREDIT_CONFIG.MIN_SCORE || creditScore.value > CREDIT_CONFIG.MAX_SCORE) {
    return ElMessage.error(`信用分必须在${CREDIT_CONFIG.MIN_SCORE}-${CREDIT_CONFIG.MAX_SCORE}之间`)
  }

  try {
    // 调用API更新信用分
    const response = await userAPI.updateCreditScore(currentUser.value.id, creditScore.value)
    if (response.code === 200) {
      ElMessage.success('信用分更新成功')
      creditDialogVisible.value = false // 关闭对话框
      fetchUserList() // 刷新用户列表
      fetchUserStats() // 刷新统计数据
    } else {
      ElMessage.error(response.message || '更新失败')
    }
  } catch (error) {
    console.error('信用分更新失败:', error)
    ElMessage.error('网络异常，更新失败')
  }
}

// 封禁用户（原有逻辑）
const handleBanUser = async (userId) => {
  try {
    await ElMessageBox.confirm('确定要封禁该用户吗？封禁后用户无法预约座位', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    const response = await userAPI.toggleUserStatus(userId, 'banned')
    if (response.code === 200) {
      ElMessage.success('用户已封禁')
      fetchUserList()
      fetchUserStats()
    }
  } catch (error) {
    // 用户取消操作，不提示
  }
}

// 解封用户（原有逻辑）
const handleUnbanUser = async (userId) => {
  try {
    const response = await userAPI.toggleUserStatus(userId, 'normal')
    if (response.code === 200) {
      ElMessage.success('用户已解封')
      fetchUserList()
      fetchUserStats()
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 信用分标签样式判断（新增逻辑）
const getCreditType = (score) => {
  if (score >= CREDIT_CONFIG.NORMAL_THRESHOLD) return 'success'
  if (score >= CREDIT_CONFIG.WARNING_THRESHOLD) return 'warning'
  return 'danger'
}

// 状态标签样式判断（原有逻辑）
const getStatusType = (status) => {
  const statusMap = {
    'normal': 'success',
    'warning': 'warning',
    'banned': 'danger'
  }
  return statusMap[status] || 'info'
}

// 状态文本转换（原有逻辑）
const getStatusText = (status) => {
  const statusMap = {
    'normal': '正常',
    'warning': '警告', 
    'banned': '封禁'
  }
  return statusMap[status] || '未知'
}

// 页面加载时初始化数据（原有逻辑）
onMounted(() => {
  fetchUserList()
  fetchUserStats()
})

// 监听筛选条件变化，重置分页并刷新列表（原有逻辑）
watch([statusFilter, collegeFilter, searchKeyword], () => {
  currentPage.value = 1
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .el-icon {
  font-size: 28px;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.stat-value {
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin: 4px 0 0 0;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 12px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
}

.el-table {
  border-radius: 12px 12px 0 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 信用分相关样式（新增） */
.credit-dialog {
  padding: 10px 0;
}

.user-info {
  font-size: 15px;
  color: #333;
  margin: 0 0 16px 0;
}

.credit-rule {
  margin: 16px 0;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.credit-rule h4 {
  font-size: 14px;
  color: #1e40af;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.credit-rule ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.slider-value {
  text-align: center;
  font-size: 15px;
  color: #333;
  margin-top: 8px;
}

.slider-value .score {
  color: #1e40af;
  font-weight: 600;
  margin: 0 4px;
}

.status-tip {
  color: #666;
  font-size: 13px;
  margin-left: 8px;
}
</style>