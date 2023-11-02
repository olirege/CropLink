import './index.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth }  from "./firebase/main";
import { getDocument } from "./firebase/utils";
import { useMainStore } from './stores/main';
import { storeToRefs } from 'pinia';
let app: any;
let profile: any;
onAuthStateChanged(auth, async (user) => {
    if (user) {
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
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
}
