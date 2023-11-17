import { initializeApp } from 'firebase/app';
import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { api } from '../utils/api'

export const useMainStore = defineStore('mainStore', {
    state: () => ({
      name: 'Main Store',
      env: '',
      googleApiKey: '',
      firebaseApp: null,
      buildInfo: {},
      route: null,
      adminUser: false,
      id: null,
      uid: null,
      currentUser: null,
      profileData: null,
      profileLoaded: false,
      firstname: '',
      lastname: '',
      fullname: '',
    }),
    actions: {
      setFirebaseApp(fb) {
          this.firebaseApp = fb
      },
      setGoogleApiKey(apiKey) {
          this.googleApiKey = apiKey
      },
      setRoute(to) {
          this.route = to
      },
      async initialize() {
        const auth = getAuth();
        const user = auth.currentUser;
        this.currentUser = user;
    
        return new Promise(async (resolve, reject) => {
            try {
                onAuthStateChanged(auth, async (user) => {
                    try {
                        await this.authStateChanged(user, '');
                        resolve(); 
                    } catch (e) {
                        console.error('Error in onAuthStateChanged:', e);
                        reject(e); 
                    }
                });
            } catch (e) {
                console.error('Error in initialize:', e);
                reject(e); 
            }
        });
      },
      async authStateChanged(user, create) {
          try {
              if (!user) this.currentUser = null
              console.debug(`MS01:${Boolean(user)}`)
              if (user) {
                console.debug('MS02')
                let snapshot = await api.get(
                  `/account/${user.uid}?include=profile&create=${create}`,
                  {
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                    },
                  },
                )
                const data = snapshot.data
                const id = data ? data.id : null
                let userData = data ? data.data : null
                this.currentUser = user
                console.log(`There is a user! ${id}` )
                if (id) {
                  console.log('Setting up profile!')
                  this.id = id
                  this.uid = userData.uid
                  this.firstname = userData.firstname
                  this.lastname = userData.lastname
                  this.fullname = userData.firstname + ' ' + userData.lastname
                  this.profileData = userData
                  console.log(userData)
                } 
              } else {
                  console.log('There is NO user!')
              }
          } catch (e) {
              console.error(e)
          }
      }
    },
    getters: {},
})