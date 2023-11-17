import { defineStore } from "pinia"
import router from "@/router/router";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useLoginStore = defineStore('loginStore', {
    state: () => ({
        isAuthorizedUser: false,
        isUserLogin: false,
        initiateLogin: false
    }),
    actions: {
        async emailLoginComplete() {
            console.log("User is Signed-In!")
        },
        async loginWithEmail(payload) {
            this.initiateLogin = true
            const auth = getAuth();
            let r = await signInWithEmailAndPassword(auth, payload.email, payload.password)
            if (r.user) {
                this.isUserLogin = true
                return { status: this.isUserLogin, message: 'User logged-in'}
            }
            return console.log('There was an error login in')
        },
        async logOut() {
            const auth = getAuth()
            signOut(auth).then(() => {
                router.push("/")
                console.log("User signed-out successfully!")
            }).catch((e) => {
                console.error(e)
            })
        }
    },
    getters: {

    }
})