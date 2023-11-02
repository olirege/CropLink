import { getFunctions, httpsCallable } from "firebase/functions";

export function createUserProfileCallable() {
    console.log("createUserProfileCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createUserProfile");
}
export function createAdCallable() {
    console.log("createAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createAd");
}
export function postAdCallable() {
    console.log("postAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "postAd");
}