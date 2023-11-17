import { defineStore } from "pinia"
import { api } from '../utils/api.js';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export const useSignUpStore = defineStore('signUpStore', {
    state: () => ({
        isUserLoggedIn: false,
        isSigningUp: false,
        isSignedUp: false,
        verificationSent: false,
        isVerified: false, 
        emailInUse: false,
    }),
    actions: {
        async signUpWithEmail(payload) {
            console.log('This is the store for api call action!')
            this.isSigningUp = true
            let userAuth = null
            if (payload.userData.email && payload.userData.password) {
                const auth = getAuth();
                try {
                    userAuth = await createUserWithEmailAndPassword(auth, payload.userData.email, payload.userData.password)
                } catch(e) {
                    if (e.code === 'auth/email-already-in-use') {
                        this.emailInUse = true
                        this.isSigningUp = false
                        return { emailInUse: this.emailInUse, errorMessage: 'Email is already in use. Please choose a different email or try to login in.'}
                      } else {
                        console.error('Error creating user:', e.message);
                      }
                }
            }
            payload.userId = userAuth.user.uid

            let url = `/waitlist`
            let waitlist = await api.post(url, payload)
            console.log('Waitlist created and email sent!')

            if (waitlist.data.verified === true) {
                console.log('User is verified, Redirecting!')
                this.isSignedUp = true
                this.isVerified = true
                this.verificationSent = true
                this.isSigningUp = false
                return { isSignedUp: this.isSignedUp, isVerified: this.isVerified }
            } else if (userAuth.user.uid && waitlist.data.id) {
                console.log('User Created and waiting for verification!')
                this.isSignedUp = true
                if (waitlist.data && waitlist.data.email && waitlist.data.email.text === 'OK') this.verificationSent = true
                this.isSigningUp = false
                return { isSignedUp: this.isSignedUp }
            } else {
                console.log('Error Sign-up')
            }
        },
        async validateVerification(payload) {
            console.log('Verifying in backend!')
            let url = `/verification/${payload.code}?profileId=${payload.profileId}`
            let verification = await api.get(url)
            if (verification.data.verified && verification.data.status === 200) {
                this.isVerified = verification.data.verified
            } else if (verification.data.status === 500 && !verification.data.verified) {
                this.isVerified = verification.data.verified
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
          
            return { isVerified: this.isVerified, text: verification.data.text };
          }
    },
    getters: {

    }
})