import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import router from './router'
import vuetify from './plugins/vuetify'
import Cookies from './util/Cookies'
let cookies = Cookies.parseWithoutLang()
if (!cookies.language && navigator.language === 'ru-RU') window.location.replace(`/translate?redirect=${document.location.href}`);

Vue.config.productionTip = false

Vue.use(VueMeta)

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
