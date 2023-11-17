import { defineStore } from 'pinia';
import { api } from '../../utils/api';

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        name: 'task store',
        tasks: [],
        groups: [
            { id: 'work', name: 'Work', color: 'blue' },
            { id: 'ministry', name: 'Ministry', color: 'green' }, 
            { id: 'marriage', name: 'Marriage', color: 'red'}
        ],
    }),
    actions: {
        async addTask(task) {
            let payload = task
            let url = `/task`
            let r = await api.post(url, payload)
            let t = r.data
            let tasks = this.tasks
            tasks.push(t)
            console.log(t)
            return { status: 'added'}
        },
        async updateTask(id, action) {
            let tasks = this.tasks
            let payload
            tasks.find((t) => {
                if (t.id === id) {
                    payload = t.data
                    if (action === 'completed') t.data.completed = !t.data.completed
                } 
            })
            let url = `/task/${id}?action=${action}`
            let r = await api.patch(url, payload)
            
            if (action === 'completed') {
                let task
                tasks.find((t) => {
                    if (t.id === id) return task = t
                })
                task.data.updatedAt = r.data.data.updatedAt
            }
            
            return { status: 'updated'}
        },
        async deleteTask(id) {
            let url = `/task/${id}`
            let r = await api.delete(url)
            let tasks = this.tasks
            if (r.data.status === 'deleted') {
                for(let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === r.data.id) {
                        tasks.splice(i, 1)
                    }
                }
            }
            return { status: r.data.status }
        },
        async fetchTasks() {
            let url = `/tasks`
            let r = await api.get(url)
            this.tasks = r.data.data
            console.log(r.data)
        }
    },
    getters: {
        getGroups(state) {
            return state.groups
        },
        getTasks(state) {
            return state.tasks
        }
    },
})  