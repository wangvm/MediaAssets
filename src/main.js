import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//安装less
import less from 'less'
//安装ant-design UI库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less'

Vue.config.productionTip = false
Vue.use(less)
Vue.use(Antd)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
