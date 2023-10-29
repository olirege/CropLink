import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; 
import { firebaseConfig } from "./config";
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const functions = getFunctions(app);