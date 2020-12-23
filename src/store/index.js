import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userName: null
    },
    mutations: {
        exit(state) {
            state.userName = null
        }
    },
    actions: {},
    modules: {}
})
