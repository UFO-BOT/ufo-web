import Vue from 'vue'
import VueRouter from 'vue-router'
import routesList from './routes.json'

Vue.use(VueRouter)

function loadRoutes(routes) {
  let newRoutes = []
  routes.forEach(route => {
    newRoutes.push({
      path: route.path,
      name: route.name,
      component: () => import(`@/views/${route.component}`),
      children: route.children ? loadRoutes(route.children) : []
    })
  })
  return newRoutes;
}
let routes = loadRoutes(routesList);

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
