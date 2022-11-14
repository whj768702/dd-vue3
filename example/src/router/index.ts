import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "AboutView" */ '../views/AboutView.vue')
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "ListDemo" */'../views/ListDemo.vue')
  },
  {
    path: '/simple',
    name: 'simple',
    component: () => import(/* webpackChunkName: "SimpleDemo" */'../views/SimpleDemo.vue')
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import(/* webpackChunkName: "TreeDemo" */'../views/TreeDemo.vue')
  },
  {
    path: '/nested',
    name: 'nested',
    component: () => import(/* webpackChunkName: "NestedDemo" */'../views/NestedDemo.vue')
  },
  {
    path: '/horizontal',
    name: 'horizontal',
    component: () => import(/* webpackChunkName: "horizontal" */'../views/HorizontalDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
