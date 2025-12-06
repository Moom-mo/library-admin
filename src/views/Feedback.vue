<template>
  <div class="feedback-container">
    <div class="header">
      <h2>用户反馈管理</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索反馈内容/用户名"
        style="width: 300px"
        clearable
        @keyup.enter="loadFeedbackList"
      >
        <template #append>
          <el-button @click="loadFeedbackList" icon="Search" />
        </template>
      </el-input>
    </div>

    <!-- 标签页切换：未处理/已处理 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" style="margin-top: 20px">
      <el-tab-pane label="未处理反馈" name="pending">
        <!-- 未处理反馈列表 -->
        <el-table
          :data="pendingFeedbackList"
          border
          stripe
          style="width: 100%; margin-top: 10px"
          v-loading="loading"
        >
          <el-table-column prop="id" label="反馈ID" width="100" />
          <el-table-column prop="userId" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户姓名" width="120" />
          <el-table-column prop="content" label="反馈内容" min-width="300" />
          <el-table-column prop="contact" label="联系方式" width="180" />
          <el-table-column prop="createTime" label="提交时间" width="200" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleProcess(scope.row)"
              >
                处理
              </el-button>
              <el-button size="small" type="text" @click="viewDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 未处理反馈分页 -->
        <el-pagination
          style="margin-top: 20px; text-align: right"
          v-model:current-page="pendingPageNum"
          v-model:page-size="pendingPageSize"
          :total="pendingTotal"
          page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadFeedbackList"
          @current-change="loadFeedbackList"
        />
      </el-tab-pane>

      <el-tab-pane label="已处理反馈" name="processed">
        <!-- 已处理反馈列表 -->
        <el-table
          :data="processedFeedbackList"
          border
          stripe
          style="width: 100%; margin-top: 10px"
          v-loading="loading"
        >
          <el-table-column prop="id" label="反馈ID" width="100" />
          <el-table-column prop="userId" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户姓名" width="120" />
          <el-table-column prop="content" label="反馈内容" min-width="300" />
          <el-table-column prop="contact" label="联系方式" width="180" />
          <el-table-column prop="createTime" label="提交时间" width="200" />
          <el-table-column prop="replyContent" label="处理回复" min-width="200" />
          <el-table-column prop="processTime" label="处理时间" width="200" />
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="small" type="text" @click="viewDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 已处理反馈分页 -->
        <el-pagination
          style="margin-top: 20px; text-align: right"
          v-model:current-page="processedPageNum"
          v-model:page-size="processedPageSize"
          :total="processedTotal"
          page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadFeedbackList"
          @current-change="loadFeedbackList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 处理反馈弹窗 -->
    <el-dialog v-model="processDialogVisible" title="处理用户反馈" width="500px">
      <el-form :model="processForm" label-width="80px">
        <el-form-item label="反馈内容">
          <el-input v-model="processForm.content" type="textarea" rows="4" disabled />
        </el-form-item>
        <el-form-item label="处理回复" required>
          <el-input v-model="processForm.replyContent" type="textarea" rows="4" placeholder="请输入回复内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcess">提交处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 导入模拟数据
import { pendingFeedbackMock, processedFeedbackMock, updateFeedbackMock } from '@/api/mock/feedbackMock'
// 注释真实接口，开发阶段使用模拟数据
// import { getFeedbackList, updateFeedbackStatus } from '@/api/feedback'

// 加载状态
const loading = ref(false)
// 激活的标签页：pending-未处理，processed-已处理
const activeTab = ref('pending')
// 搜索关键词
const searchKeyword = ref('')

// ========== 未处理反馈分页/数据 ==========
const pendingPageNum = ref(1)
const pendingPageSize = ref(10)
const pendingTotal = ref(0)
const pendingFeedbackList = ref([])

// ========== 已处理反馈分页/数据 ==========
const processedPageNum = ref(1)
const processedPageSize = ref(10)
const processedTotal = ref(0)
const processedFeedbackList = ref([])

// 处理弹窗状态
const processDialogVisible = ref(false)
// 处理表单数据
const processForm = ref({
  id: '',
  content: '',
  replyContent: ''
})

// 加载反馈列表（使用模拟数据）
const loadFeedbackList = async () => {
  loading.value = true
  try {
    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 未处理反馈（模拟搜索筛选）
    let pendingList = pendingFeedbackMock.data.list
    if (searchKeyword.value) {
      pendingList = pendingList.filter(item => 
        item.content.includes(searchKeyword.value) || item.username.includes(searchKeyword.value)
      )
    }
    pendingFeedbackList.value = pendingList
    pendingTotal.value = pendingList.length

    // 已处理反馈（模拟搜索筛选）
    let processedList = processedFeedbackMock.data.list
    if (searchKeyword.value) {
      processedList = processedList.filter(item => 
        item.content.includes(searchKeyword.value) || item.username.includes(searchKeyword.value)
      )
    }
    processedFeedbackList.value = processedList
    processedTotal.value = processedList.length
  } catch (err) {
    ElMessage.error('获取反馈列表失败，请稍后重试')
    console.error('获取反馈列表失败：', err)
  } finally {
    loading.value = false
  }
}

// 切换标签页时重置分页
const handleTabChange = (tabName) => {
  if (tabName === 'pending') {
    pendingPageNum.value = 1
  } else {
    processedPageNum.value = 1
  }
  loadFeedbackList()
}

// 处理反馈
const handleProcess = (row) => {
  processForm.value = {
    id: row.id,
    content: row.content,
    replyContent: ''
  }
  processDialogVisible.value = true
}

// 提交处理结果（模拟接口）
const submitProcess = async () => {
  if (!processForm.value.replyContent.trim()) {
    return ElMessage.warning('请输入处理回复内容')
  }
  try {
    // 模拟接口请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟接口返回成功
    if (updateFeedbackMock.code === 200) {
      ElMessage.success('反馈处理成功')
      processDialogVisible.value = false

      // 1. 从		        未处理列表移除该条数据
      pendingFeedbackList.value = pendingFeedbackList.value.filter(item => item.id !== processForm.value.id)
      pendingTotal.value = pendingFeedbackList.value.length

      // 2. 构造已处理数据并添加到已处理列表
      const now = new Date()
      const processTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      
      const processedItem = {
        ...pendingFeedbackMock.data.list.find(item => item.id === processForm.value.id),
        status: 'processed',
        replyContent: processForm.value.replyContent,
        processTime
      }
      processedFeedbackList.value.unshift(processedItem)
      processedTotal.value = processedFeedbackList.value.length
    }
  } catch (err) {
    ElMessage.error('反馈处理失败，请稍后重试')
    console.error('处理反馈失败：', err)
  }
}

// 查看反馈详情
const viewDetail = (row) => {
  console.log('反馈详情：', row)
  ElMessage.info(`反馈ID：${row.id}，用户：${row.username}，反馈内容：${row.content}`)
}

// 初始化加载列表
onMounted(() => {
  loadFeedbackList()
})
</script>

<style scoped>
.feedback-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>