<script setup>
import { ref, onMounted, watch } from 'vue'
import { Plus, Upload, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { seatAPI } from '../api/index.js'  // 修改导入路径

const searchKeyword = ref('')
const floorFilter = ref('')
const areaFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 响应式座位数据
const seatData = ref([])

// 获取座位列表
const fetchSeatList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      floor: floorFilter.value,
      area: areaFilter.value
    }
    
    const response = await seatAPI.getSeatList(params)
    if (response.code === 200) {
      seatData.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取座位列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 删除座位
const handleDelete = async (seatId) => {
  try {
    const response = await seatAPI.deleteSeat(seatId)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchSeatList() // 重新加载数据
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchSeatList()
})

// 监听筛选条件变化
watch([floorFilter, areaFilter], () => {
  currentPage.value = 1
  fetchSeatList()
})

const getStatusType = (status) => {
  const statusMap = {
    'available': 'success',
    'occupied': 'danger',
    'temporary': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'available': '可用',
    'occupied': '占用', 
    'temporary': '暂离'
  }
  return statusMap[status] || '未知'
}
</script>

<style scoped>
.seat-management {
  padding: 20px;
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

.filter-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.facilities {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}
</style>

<template>
  <div class="seat-management">
    <div class="page-header">
      <h2 class="page-title">座位管理</h2>
      <div class="action-buttons">
        <el-button type="primary" :icon="Plus">新增座位</el-button>
        <el-button :icon="Upload">批量导入</el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索座位编号/区域"
          :prefix-icon="Search"
          style="width: 300px"
        />
        <el-select v-model="floorFilter" placeholder="所有楼层">
          <el-option label="所有楼层" value="" />
          <el-option label="一楼" value="1F" />
          <el-option label="二楼" value="2F" />
          <el-option label="三楼" value="3F" />
        </el-select>
        <el-select v-model="areaFilter" placeholder="所有区域">
          <el-option label="所有区域" value="" />
          <el-option label="安静区" value="quiet" />
          <el-option label="讨论区" value="discussion" />
          <el-option label="窗边座位" value="window" />
        </el-select>
      </div>
    </el-card>

    <!-- 座位表格 -->
    <el-card class="table-card">
      <el-table :data="seatData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="座位编号" width="120" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column label="设施" width="180">
          <template #default="{ row }">
            <div class="facilities">
              <el-tag v-if="row.hasPower" size="small" type="success">电源</el-tag>
              <el-tag v-if="row.hasLamp" size="small" type="primary">台灯</el-tag>
              <el-tag v-if="row.hasPartition" size="small" type="info">隔音</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" :icon="Edit" size="small" link />
              <el-button type="danger" :icon="Delete" size="small" link @click="handleDelete(row.id)" />
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
        />
      </div>
    </el-card>
  </div>
</template>