import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginType:'',
        currentMenu: '',
        token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
    },
    mutations: {
        updateLoginType(state, pre) {
            state.loginType = pre
        },
        updateCurrentMenu(state, pre) {
            state.currentMenu = pre
        },
        setToken (state, token) {
            state.token = token;
            localStorage.setItem("token", token.token);//存储token
        },
        delToken (state) {
            state.token = '';
            localStorage.removeItem("token");//删除token
        }
    },
    actions: {},
    modules: {}
})
