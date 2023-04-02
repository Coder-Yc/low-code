import Login from '../packages/user/login.jsx'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    component: Login
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
