import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; 
import { firebaseConfig } from "./config";
import { getStorage, ref } from "firebase/storage";
import * as firebaseui from "firebaseui";
import './firebase-ui.css'
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const functions = getFunctions(app, "northamerica-northeast1");
export const auth = getAuth(app);
export const ui = new firebaseui.auth.AuthUI(auth);
export const storage = getStorage(app);
export const storageRef = ref(storage);