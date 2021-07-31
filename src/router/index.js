import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/calculator',
        name: 'Calculator',
        component: () => import(/* webpackChunkName: "about" */ '../views/Calculator.vue')
    },
    {
        path: '/demo',
        name: 'Demo',
        component: () => import(/* webpackChunkName: "about" */ '../views/Demo.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
