import './assets/main.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth }  from "./firebase/main";

onAuthStateChanged(auth, user => {
    if (user) {
        console.log("User is signed in");
    } else {
        console.log("No user is signed in");
        router.push({ name: "signup" });
    }
});

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
