import './index.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth }  from "./firebase/main";
import { getDocument } from "./firebase/utils";
import { useMainStore } from './stores/main';
import currency from './directives/currency';
let app: any;
let profile: any;
const dev = process.env.NODE_ENV === 'development';
onAuthStateChanged(auth, async (user) => {
    if (!dev) {
        devByPass()
        return;
    } 
    if (user) {
        console.log("User is signed in", user)
        try {
            profile = await getDocument("users", user.uid)
            if(profile) {
                if(!app) initApp();
                useMainStore().setProfile(profile);
            }
        } catch (error) {
            console.log("Error getting profile", error);
        }
        if(!app) initApp();
        console.log("User is signed in");
        useMainStore().setUser(user);
    } else {
        if(!app) initApp();
        console.log("User is signed out");
    }
});

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
const initApp = () => {
    const loadingElement = document.getElementById('main__loading');
    if (loadingElement) {
      loadingElement.remove();
    }
    app = createApp(App)
    app.use(createPinia())
    app.directive('currency', currency)
    app.use(router)
    app.mount('#app')
}
const devByPass = async () => {
    console.log("TRIAL MODE")
    const profile = await getDocument("users", import.meta.env.VITE_DEV_USER_UID)
    if(profile) {
        if(!app) initApp();
        useMainStore().setProfile(profile);
        useMainStore().setUser({uid: import.meta.env.VITE_DEV_USER_UID});
    }
}