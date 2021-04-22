import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import Vuex from 'vuex'
import router from './router'
import store from '@/store'
import vuetify from './plugins/vuetify'

let cookiesToDelete = ['language', 'refreshToken', 'theme', 'token']
document.cookie.split('; ').forEach(cookie => {
  if (cookie.trim().length > 0) {
    let cookieSplit = cookie.split('=');
    let cookieParse = {
      name: cookieSplit[0],
      value: cookieSplit.pop()
    }
    if(cookiesToDelete.includes(cookieParse.name)) {
      localStorage.setItem(cookieParse.name, cookieParse.value)
      document.cookie = `${cookieParse.name}= ;max-age=0`
    }
  }
})

if (!localStorage.getItem('language')) {
  if(navigator.language === 'ru-RU') {
    localStorage.setItem('language', 'ru')
    window.location.reload()
  }
  else localStorage.setItem('language', 'en')
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
