import Vue from 'vue'
import VueRouter from 'vue-router'
import routesList from './routes.json'

Vue.use(VueRouter)

let routes = []
routesList.forEach(route => {
  routes.push({
    path: route.path,
    name: route.name,
    component: () => import(`@/views/${route.component}`)
  })
})

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
