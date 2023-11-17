import { createApp } from 'vue'
import App from '@/App.vue'
import { initializeApp } from "firebase/app";
import '@/styles/style.css'
import router from '@/router/router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify.js'
import { useMainStore } from '@/stores/Store.js'
import fbConfig from '../.firebase-config.json'

console.log('lonche.app version=0.0.1')

const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router).use(vuetify);
//I need to figure all the firebase start point before adding to the data base.
//, for now add to local store.
//let env = process.env.NODE_ENV || 'production'
//const IS_PRODUCTION = env !== 'development'
const mainStore = useMainStore();
const firebaseConfig = fbConfig
//if (IS_PRODUCTION) firebaseConfig.authDomain = window.location.hostname
const fb = initializeApp(firebaseConfig);
mainStore.setFirebaseApp(fb, () => {
    return fb
});
mainStore.setGoogleApiKey(firebaseConfig.apiKey);

mainStore.initialize();

//Have to figure out beforeEach for a better router!
// router.beforeEach(async (to, from, next) => {
//     const user = mainStore.currentUser;
//     if (to.meta.requiresAuth && !user) {
//       next('/login');
//     } else {
//       mainStore.setRoute(to);
//       next();
//     }
//   });
router.beforeEach(async (to, from, next) => {
    mainStore.setRoute(to)
    next()
})

app.mount('#app')