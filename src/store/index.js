import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        ifLogin: false,
        currentMenu: '',
    },
    mutations: {
        changeIfLogin(state, pre) {
            state.ifLogin = pre
        },
        updateCurrentMenu(state, pre) {
            state.currentMenu = pre
        }
    },
    actions: {},
    modules: {}
})
