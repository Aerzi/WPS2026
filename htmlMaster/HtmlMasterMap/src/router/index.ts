import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/timeline',
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineChart.vue'),
      meta: {
        title: '时间轴图表',
      },
    },
    {
      path: '/pentagon',
      name: 'pentagon',
      component: () => import('../views/PentagonChart.vue'),
      meta: {
        title: '五段式环形图',
      },
    },
    {
      path: '/gantt',
      name: 'gantt',
      component: () => import('../views/GanttChart.vue'),
      meta: {
        title: '甘特图',
      },
    },
  ],
})

export default router
