import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginType:'',
        currentMenu: '',
    },
    mutations: {
        updateLoginType(state, pre) {
            state.loginType = pre
        },
        updateCurrentMenu(state, pre) {
            state.currentMenu = pre
        }
    },
    actions: {},
    modules: {}
})
