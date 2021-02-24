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

export default router
