import { defineStore } from "pinia";
import { api } from '../../utils/api';
import { useAppMainStore } from "./index";
import { useMainStore } from "../../stores/Store";

export const usePlanStore = defineStore('planStore', {
    state: () => ({
        name: 'plan store',
        plans: [],
        loading: true
    }),
    actions: {
        async getPlans(pid, force) {
            if (!force && this.plans.length === 0) {
                let url = `/plans?pid=${pid}`
                let r = await api.get(url)
                this.plans = r.data.data
                this.loading = false
                console.log(r.data.data)
                return
            }
        },
        async addPlan(plan) {
            const mainStore = useMainStore()
            let userId = mainStore.id
            plan.created_by = userId
            let url = `/plan`
            let r = await api.post(url, plan)
            let newPlan = r.data
            let plans = this.plans
            plans.push(newPlan)
            return { status: 'added'}
        }
    },
    getters: {}
})