import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/commands',
    name: 'Commands',
    component: () => import('@/views/Commands.vue')
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/Stats.vue')
  },
  {
    path: '/invite',
    name: 'Invite',
    component: () => import('@/views/Invite.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
