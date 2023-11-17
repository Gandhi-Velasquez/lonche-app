import { createRouter, createWebHistory } from "vue-router";
const PlannerApp = () => import('@/planner/App.vue')

const routes = [
    {
        path: '/planner', 
        name: 'planner', 
        component: PlannerApp,
        meta: { requiresAuth: true },
    }
]

export default routes 