import { getFunctions, httpsCallable } from "firebase/functions";

export function createUserProfileCallable() {
    console.log("createUserProfileCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createUserProfile");
}
export function createAdCallable() {
    console.log("createAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createAd");
}
export function removeAdCallable() {
    console.log("removeAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "removeAd");
}
export function editAdCallable() {
    console.log("editAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "editAd");
}
export function postAdCallable() {
    console.log("postAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "postAd");
}
export function placeBidCallable() {
    console.log("placeBidCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "placeBid");
}
export function cancelBidCallable() {
    console.log("cancelBidCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "cancelBid");
}