import App from './App.vue'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import Vuex from 'vuex'
import router from './router'
import store from '@/store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = true

Vue.use(VueMeta)
Vue.use(Vuex)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
