<template>
  <aside class="sidebar">
    <el-menu
      :default-active="currentRoute"
      class="sidebar-menu"
      background-color="#1e40af"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <span>仪表盘概览</span>
      </el-menu-item>

      <el-sub-menu index="seats">
        <template #title>
          <el-icon><Position /></el-icon>
          <span>座位管理</span>
        </template>
        <el-menu-item index="/seats">座位列表</el-menu-item>
        <el-menu-item index="/seats/import">批量导入</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/monitor">
        <el-icon><MapLocation /></el-icon>
        <span>实时监控地图</span>
      </el-menu-item>

      <el-sub-menu index="users">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/users">用户列表</el-menu-item>
        <el-menu-item index="/users/credit">信用分管理</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/reports">
        <el-icon><DataLine /></el-icon>
        <span>数据报表</span>
      </el-menu-item>

      <el-menu-item index="/feedback">
        <el-icon><Document /></el-icon>
        <span>事务处理</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  Position,
  MapLocation,
  User,
  DataLine,
  Document
} from '@element-plus/icons-vue'

const route = useRoute()
const currentRoute = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #1e40af;
  height: 100%;
}

.sidebar-menu {
  border: none;
  width: 100%;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background-color: #1e3a8a !important;
}
</style>