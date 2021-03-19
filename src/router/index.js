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
