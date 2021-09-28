import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/element.config'
//安装less
import less from 'less'
import VueParticles from 'vue-particles'
import dayjs from "dayjs"
import VueLazyload from 'vue-lazyload'
// 引用loadsh
// import _ from "loadsh"

Vue.prototype.dayjs = dayjs;//可以全局使用dayjs

Vue.config.productionTip = false

Vue.use(less)
Vue.use(VueParticles)
Vue.use(VueLazyload)
// 引用loadsh
// Vue.use(_)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
