import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import Vuex from 'vuex'
import router from './router'
import store from '@/store'
import vuetify from './plugins/vuetify'
import Cookies from './util/cookies'

let cookies = Cookies.parseWithoutLang()
if (!cookies.language) {
  if(navigator.language === 'ru-RU') {
    Cookies.set('language', 'ru')
    window.location.reload()
  }
  else Cookies.set('language', 'en')
}

Vue.config.productionTip = true

Vue.use(VueMeta)
Vue.use(Vuex)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
