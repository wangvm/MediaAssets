import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        ifLogin: false,
    },
    mutations: {
        changeIfLogin(state, pre) {
            state.ifLogin = pre
        }
    },
    actions: {},
    modules: {}
})
