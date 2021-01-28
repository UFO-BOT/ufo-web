import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import guild from './modules/guild'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        guild
    }
})