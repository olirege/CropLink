import { getFunctions, httpsCallable } from "firebase/functions";

export function createUserProfileCallable() {
    console.log("createUserProfileCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createUserProfile");
}