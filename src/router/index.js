import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../views/home/home"
import login from "../views/login/login"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/login',
        name: 'login',
        component: login
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
