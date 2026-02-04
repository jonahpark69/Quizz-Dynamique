import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/quiz'
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../views/QuizView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/quiz'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
