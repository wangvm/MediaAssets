import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../views/home/home"
import admin from "../views/admin/admin"
// test
import Home from "../views/Home"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/admin',
        name: 'admin',
        component: admin
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


// router.beforeEach((to, from, next) => {
//     if (to.path === '/') {//若要跳转的页面时登陆页面
//         next();//则直接跳转
//     }
//     else if (to.path === '/admin') {//若要跳转的页面是个人界面
//         let token = localStorage.getItem('token');//获取本地存储的token值
//         if (token === null||token === '') {//若token为空则验证不通过，跳转到登录界面
//             next('/');
//         }else {//不为空则验证成功
//             next();
//         }
//     }else {
//         next();//     }
// });

export default router
