import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//安装less
import less from 'less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueParticles from 'vue-particles'
//安装ant-design UI库
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'

Vue.config.productionTip = false
Vue.use(less)
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.use(Antd)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')