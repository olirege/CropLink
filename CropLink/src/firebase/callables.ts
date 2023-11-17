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
export function takedownAdCallable() {
    console.log("takedownAdCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "takedownAd");
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
export function getTransactionCallable() {
    console.log("getTransactionCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "getTransaction");
}
export function createEscrowAccountCallable() {
    console.log("createEscrowAccountCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createEscrowAccount");
}
export function getEscrowLandingPageCallable() {
    console.log("getEscrowLandingPageCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "getEscrowLandingPage");
}
export function linkEscrowAccountCallable() {
    console.log("linkEscrowAccountCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "linkEscrowAccount");
}
export function createJobPostCallable() {
    console.log("createJobPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createJobPost");
}
export function editJobPostCallable() {
    console.log("editJobPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "editJobPost");
}
export function removeJobPostCallable() {
    console.log("removeJobPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "removeJobPost");
}
export function postJobPostCallable() {
    console.log("postJobPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "postJobPost");
}
export function takedownJobPostCallable() {
    console.log("takedownJobPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "takeDownJobPost");
}
export function createGigPostCallable() {
    console.log("createGigPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "createGigPost");
}
export function editGigPostCallable() {
    console.log("editGigPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "editGigPost");
}
export function removeGigPostCallable() {
    console.log("removeGigPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "removeGigPost");
}
export function postGigPostCallable() {
    console.log("postGigPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "postGigPost");
}
export function takedownGigPostCallable() {
    console.log("takedownGigPostCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "takeDownGigPost");
}
export function sendDmCallable() {
    console.log("sendDmCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "sendDm");
}
export function updateProfileCallable() {
    console.log("updateProfileCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "updateProfile");
}
export function submitApplicationCallable() {
    console.log("submitApplicationCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "submitApplication");
}
export function removeApplicationCallable() {
    console.log("removeApplicationCallable")
    return httpsCallable(getFunctions(undefined, "northamerica-northeast1"), "removeApplication");
}