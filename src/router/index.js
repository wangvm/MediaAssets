import Vue from 'vue'
import VueRouter from 'vue-router'
// test
import Home from "../views/Home"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/home')
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/admin/admin'),
        redirect: '/admin/home',
        children: [
            {
                path: '/admin/home',
                component: () => import('../views/admin/childAdmin/admin-home'),
            },
            {
                path: '/admin/projectList',
                component: () => import('../views/admin/childAdmin/admin-project-list'),
            },
            {
                path: '/admin/projectCreate',
                component: () => import('../views/admin/childAdmin/admin-project-create'),
            },
            {
                path: '/admin/userList',
                component: () => import('../views/admin/childAdmin/admin-user-list'),
            }
        ]
    },
    {
        path: '/edit',
        name: 'edit',
        component: () => import('../views/edit/edit'),
        children: [
            {
                path: 'task',
                name: 'task',
                component: () => import('../views/edit/childEdit/edit-task'),
            },
            {
                path: 'check',
                name: 'check',
                component: () => import('../views/edit/childEdit/edit-check'),
            },
            {
                path: 'video',
                name: 'video',
                component: () => import('../views/edit/childEdit/edit-video'),
            }
        ]
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
