import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../views/home/home"
import admin from "../views/admin/admin"
import edit from "../views/edit/edit"
// 二级路由
import adminHome from "../views/admin/childAdmin/adminHome"
import adminProjectList from "../views/admin/childAdmin/adminProjectList"
import adminProjectCreate from "../views/admin/childAdmin/adminProjectCreate"
import adminUserList from "../views/admin/childAdmin/adminUserList"
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
        component: admin,
        redirect: '/admin/home',
        children: [
            {
                path: 'home',
                component: adminHome
            },
            {
                path: 'projectList',
                component: adminProjectList
            },
            {
                path: 'projectCreate',
                component: adminProjectCreate
            },
            {
                path: 'userList',
                component: adminUserList
            }
        ]
    },
    {
        path: '/edit',
        name: 'edit',
        component: edit
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
