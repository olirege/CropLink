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
export function createTransactionCallable() {
    console.log("createTransactionCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createTransaction");
}
export function createEscrowAccountCallable() {
    console.log("createEscrowAccountCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createEscrowAccount");
}
export function linkEscrowAccountCallable() {
    console.log("linkEscrowAccountCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "linkEscrowAccount");
}