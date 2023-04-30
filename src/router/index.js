import { createRouter, createWebHashHistory } from 'vue-router'

const Login = () => import('../packages/user/login.jsx')
const Block = () => import('../packages/block.vue')

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/Block',
    name: 'Block',
    component: Block
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
