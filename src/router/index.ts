import { createRouter, createWebHistory } from 'vue-router'
import LoadingPage from '../views/LoadingPage.vue'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loading',
      component: LoadingPage
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage
    },
    // Redirect any unknown routes to loading
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
