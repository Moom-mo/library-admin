import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/seats',
    name: 'SeatManagement',
    component: () => import('../views/SeatManagement.vue')
  },
  {
    path: '/monitor',
    name: 'RealTimeMonitor',
    component: () => import('../views/RealTimeMonitor.vue')
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('../views/UserManagement.vue')
  },
  {
    path: '/reports',
    name: 'DataReport',
    component: () => import('../views/DataReport.vue')
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router