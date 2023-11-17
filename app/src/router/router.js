import { createRouter, createWebHistory } from "vue-router";

const Home = () => import('@/components/home/Home.vue') 
const Login = () => import('@/components/common/Login.vue')
const SignUp = () => import('@/components/common/SignUp.vue')
const Verification = () => import('@/components/common/Verification.vue')
const PlannerApp = () => import('@/planner/App.vue')
const PlansManager = () => import('@/planner/views/PlansManager.vue')
const ProfileManager = () => import('@/planner/views/ProfileManager.vue')
const PlanDetails = () => import('@/planner/components/plans/PlanDetails.vue')

const routes = [
    {
        path: '/', redirect: '', name: 'Home', component: Home
    }, 
    {
        path: '/login', name: 'Login', component: Login
    },
    {
        path: '/sign-up', name: 'Sign-Up', component: SignUp
    },
    {
        path: '/sign-up/verification', name: 'Verification', component: Verification
    },
    {
        path: '/app', 
        name: 'Admin', 
        component: PlannerApp,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'plans',
                name: 'Plans',
                component: PlansManager,
            },
            {
                path: 'plans/:id',
                name: 'Plans-Details',
                component: PlanDetails,
            },
            {
                path: 'profile',
                name: 'Profile',
                component: ProfileManager,
            },
        ]
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router 