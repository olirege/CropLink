import { onCall, HttpsError, CallableOptions, CallableRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getStorage } from "firebase-admin/storage";
import { MemoryOption } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { ERROR_CODES } from "./errors";
import { isAdmin, deleteImageFromBucket } from "./utils";
import type { Ad } from "./types";
import * as sharp from "sharp";
import axios from "axios";
const service = require("../service/service.json");
admin.initializeApp({
    credential: admin.credential.cert(service as admin.ServiceAccount),
    storageBucket: process.env.BUCKETURL,
});
const callableOptions: CallableOptions = {
    cors: true,
    memory: "512MB" as MemoryOption,
    timeoutSeconds: 60,
    region: "northamerica-northeast1",
};

export const setDocument = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("setDocument", request);
    if (!isAdmin(request)) {
        throw new HttpsError("permission-denied", ERROR_CODES["permission-denied"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data.collectionName || !request.data.documentId || !request.data.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const docRef = admin.firestore().collection(request.data.collectionName).doc(request.data.documentId);
        await docRef.set(request.data.data, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});

export const createUserProfile = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("createUserProfile", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // check if user already has a profile
    const profile = await admin.firestore().collection("users").doc(uid).get();
    if (profile.exists) {
        throw new HttpsError("already-exists", ERROR_CODES["already-exists"]);
    } else {
        try {
            logger.info(typeof request.data, JSON.stringify(request.data));
            await admin.firestore().collection("users").doc(uid).set(request.data);
            return request.data;
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});

export const createAd = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("createAd", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const BUCKET_PREFIX = process.env.BUCKETURL;
        const adId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const signedUrls = [];
        const resizedSignedUrls = [];
        const bucket = getStorage().bucket();
        logger.info("image", request.data.images);
        if (request.data.images && request.data.images.length > 0) {
            for (const image of request.data.images) {
                const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const filename = `${imageId}.jpg`;
                const bucketPath= `${`ads/${uid}/ads/${adId}/` + filename}`;
                const file = bucket.file(bucketPath);
                const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "");
                const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
                await file.save(imageBuffer, { contentType: "image/jpeg" });
                const imagePath = `${BUCKET_PREFIX + `ads/${uid}/ads/${adId}/` + filename}`;
                const _imageUrl = new URL(imagePath);
                const imageUrl = _imageUrl.pathname.substring(1);
                const imageRef = bucket.file(imageUrl);
                const [signedUrl] = await imageRef.getSignedUrl({
                    action: "read",
                    expires: "03-17-2030",
                });
                signedUrls.push(signedUrl);
                const resizedImageFilename = `${imageId}_resized.jpg`;
                const resizedImageBucketPath= `${`ads/${uid}/ads/${adId}/` + resizedImageFilename}`;
                const resizedImageFile = bucket.file(resizedImageBucketPath);
                const resizedImageBuffer = await sharp(imageBuffer)
                .resize(500, 500, {
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 1 },
                })
                .jpeg()
                .toBuffer();
                await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
                const resizedImagePath = `${BUCKET_PREFIX + `ads/${uid}/ads/${adId}/` + resizedImageFilename}`;
                const _resizedImageUrl = new URL(resizedImagePath);
                const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
                const resizedImageRef = bucket.file(resizedImageUrl);
                const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                    action: "read",
                    expires: "03-17-2030",
                });
                resizedSignedUrls.push(resizedSignedUrl);
            }
        }
        logger.info(typeof request.data, JSON.stringify(request.data));
        const ad = {
            uid: uid,
            id: adId,
            ...request.data,
            images: signedUrls,
            resizedImages: resizedSignedUrls,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            live: false,
        };
        if (ad.adType === "seller") {
            ad.biddingEndTime = admin.firestore.Timestamp.fromDate(new Date(ad.biddingEndTime));
            ad.expectedHarvestDate = admin.firestore.Timestamp.fromDate(new Date(ad.expectedHarvestDate));
        }
        if (ad.adType === "buyer") {
            ad.requestDate = admin.firestore.Timestamp.fromDate(new Date(ad.requestDate));
        }
        await admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId).set(ad);
        return { ...ad };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const removeAd = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("removeAd", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // fetch ad
    const adId = request.data.adId;
    if (!adId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adRef = admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId);
    const adDoc = await adRef.get();
    if (!adDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const ad = adDoc.data() as Ad;
    if (ad.live || ad.status == "sold") {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-already-live"]);
    } else {
        try {
            await adRef.delete();
            // delete images
            const bucket = getStorage().bucket();
            if (ad.adType === "seller" && ad.images && ad.resizedImages) {
                const BUCKET_PREFIX = process.env.BUCKETPARSEDURL as string;
                for (const image of ad.images) {
                    const _imageUrl = new URL(image);
                    let imageUrl = _imageUrl.pathname.substring(1);
                    if (imageUrl.startsWith(BUCKET_PREFIX)) {
                        imageUrl = imageUrl.replace(BUCKET_PREFIX, "");
                    }
                    const imageRef = bucket.file(imageUrl);
                    await imageRef.delete();
                }
                for (const image of ad.resizedImages) {
                    const _imageUrl = new URL(image);
                    let imageUrl = _imageUrl.pathname.substring(1);
                    if (imageUrl.startsWith(BUCKET_PREFIX)) {
                        imageUrl = imageUrl.replace(BUCKET_PREFIX, "");
                    }
                    const imageRef = bucket.file(imageUrl);
                    await imageRef.delete();
                }
            }
            return { success: true };
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});
export const editAd = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("editAd", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // fetch ad
    const adId = request.data.adId;
    if (!adId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adRef = admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId);
    const adDoc = await adRef.get();
    if (!adDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const ad = adDoc.data() as Ad;
    if (ad.live || ad.status == "sold") {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-already-live"]);
    } else {
        try {
            if (request.data.changes.resizedImages && ad.resizedImages && ad.images && ad.images.length > 0 && ad.resizedImages.length > 0) {
                const bucket = getStorage().bucket();
                const BUCKET_PREFIX = process.env.BUCKETPARSEDURL as string;
                const resizedImagesToDelete = ad.resizedImages.filter((image) => !request.data.changes.resizedImages.includes(image));
                const originalImagesToDelete = resizedImagesToDelete.map((image:string) => {
                    const resizedImageNameWithoutResized = image.replace("_resized", "");
                    return resizedImageNameWithoutResized;
                });
                request.data.changes.images = request.data.changes.resizedImages.map((image:string) => {
                    const originalImageNameWithoutResized = image.replace("_resized", "");
                    return originalImageNameWithoutResized;
                });
                for (const image of resizedImagesToDelete) {
                    await deleteImageFromBucket(image, bucket, BUCKET_PREFIX);
                }
                for (const image of originalImagesToDelete) {
                    await deleteImageFromBucket(image, bucket, BUCKET_PREFIX);
                }
            }
            if (request.data.changes.newImages && request.data.changes.newImages.length > 0) {
                const BUCKET_PREFIX = process.env.BUCKETURL;
                const signedUrls = [];
                const resizedSignedUrls = [];
                const bucket = getStorage().bucket();
                logger.info("image", request.data.changes.newImages);
                for (const image of request.data.changes.newImages) {
                    const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    const filename = `${imageId}.jpg`;
                    const bucketPath= `${`ads/${uid}/ads/${adId}/` + filename}`;
                    const file = bucket.file(bucketPath);
                    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "");
                    const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
                    await file.save(imageBuffer, { contentType: "image/jpeg" });
                    const imagePath = `${BUCKET_PREFIX + `ads/${uid}/ads/${adId}/` + filename}`;
                    const _imageUrl = new URL(imagePath);
                    const imageUrl = _imageUrl.pathname.substring(1);
                    const imageRef = bucket.file(imageUrl);
                    const [signedUrl] = await imageRef.getSignedUrl({
                        action: "read",
                        expires: "03-17-2030",
                    });
                    signedUrls.push(signedUrl);
                    const resizedImageFilename = `${imageId}_resized.jpg`;
                    const resizedImageBucketPath= `${`ads/${uid}/ads/${adId}/` + resizedImageFilename}`;
                    const resizedImageFile = bucket.file(resizedImageBucketPath);
                    const resizedImageBuffer = await sharp(imageBuffer)
                    .resize(500, 500, {
                        fit: "contain",
                        background: { r: 0, g: 0, b: 0, alpha: 1 },
                    })
                    .jpeg()
                    .toBuffer();
                    await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
                    const resizedImagePath = `${BUCKET_PREFIX + `ads/${uid}/ads/${adId}/` + resizedImageFilename}`;
                    const _resizedImageUrl = new URL(resizedImagePath);
                    const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
                    const resizedImageRef = bucket.file(resizedImageUrl);
                    const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                        action: "read",
                        expires: "03-17-2030",
                    });
                    resizedSignedUrls.push(resizedSignedUrl);
                }
                request.data.changes.images = [...request.data.changes.images, ...signedUrls];
                request.data.changes.resizedImages = [...request.data.changes.resizedImages, ...resizedSignedUrls];
            }
            await adRef.set({ ...request.data.changes, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return { success: true };
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});
export const postAd = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("postAd", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // fetch ad
    const adId = request.data.adId;
    if (!adId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adRef = admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId);
    const adDoc = await adRef.get();
    if (!adDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const ad = adDoc.data() as Ad;
    if (ad.live) {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-already-live"]);
    } else {
        try {
            await adRef.set({ live: true, postedOn: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return { success: true };
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});
export const placeBid = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("placeBid", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // fetch ad
    const adId = request.data.adId;
    if (!adId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adRef = admin.firestore().collectionGroup("ads").where("id", "==", adId).where("live", "==", true);
    if (!adRef) {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-not-live"]);
    }
    // fetch other bids by same user
    const userBidRef = admin.firestore().collectionGroup("bids").where("buyerId", "==", uid).where("status", "==", "pending");
    const userBidDoc = await userBidRef.get();
    if (userBidDoc.docs.length > 0) {
        for (const bidDoc of userBidDoc.docs) {
            await bidDoc.ref.set({ status: "cancelled", updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
    }
    try {
        const bidId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const bid = {
            adId: adId,
            id: bidId,
            buyerId: uid,
            price: request.data.price,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "pending",
        };
        await admin.firestore().collection("bids").doc(adId).collection("bids").doc(bidId).set(bid);
        return bid;
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const cancelBid = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("cancelBid", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    // fetch bid
    const bidId = request.data.bidId;
    if (!bidId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const bidRef = admin.firestore().collectionGroup("bids").where("id", "==", bidId).where("buyerId", "==", uid);
    if (!bidRef) {
        throw new HttpsError("invalid-argument", ERROR_CODES["bid-not-found"]);
    }
    const bidDoc = await bidRef.get();
    if (!bidDoc.docs[0].exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["bid-not-found"]);
    }
    if (bidDoc.docs[0].data().status === "cancelled") {
        throw new HttpsError("invalid-argument", ERROR_CODES["bid-already-cancelled"]);
    }
    try {
        await bidDoc.docs[0].ref.set({ status: "cancelled", updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const terminateBidSession = onSchedule({
    schedule: "every day 17:00",
    region: "northamerica-northeast1",
    timeZone: "America/Toronto",
    memory: "1GB" as MemoryOption,
    }, async () => {
        // fetch all ads that are live and have a bidding end time of today
        logger.info("terminateBidSession");
        const adsRef = admin.firestore().collectionGroup("ads").where("live", "==", true).where("adType", "==", "seller").where("biddingEndTime", "<=", admin.firestore.Timestamp.now());
        const ads = await adsRef.get();
        if (ads.empty) {
            logger.info("terminateBidSession", "no ads found");
            return;
        }
        // for each ad, fetch all bids
        const bidsRef = admin.firestore().collectionGroup("bids").where("status", "==", "pending").where("adId", "in", ads.docs.map((ad) => ad.id)).orderBy("price", "desc");
        const bids = await bidsRef.get();
        if (bids.empty) {
            logger.info("terminateBidSession", "no bids found");
            return;
        }
        // for each ad, fetch the highest bid
        const highestBids = [];
        for (const ad of ads.docs) {
            const highestBid = bids.docs.filter((bid) => bid.data().adId === ad.id)[0];
            if (highestBid) {
                highestBids.push(highestBid);
            }
        }
        // set all bids to cancelled except the highest bid
        for (const bid of bids.docs) {
            if (!highestBids.includes(bid)) {
                await bid.ref.set({ status: "cancelled", endedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            }
        }
        // set all highest bids to accepted
        for (const highestBid of highestBids) {
            await highestBid.ref.set({ status: "accepted", endedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
        // set all ads to not live and set its status to sold
        for (const ad of ads.docs) {
            await ad.ref.set({ live: false, endedAt: admin.firestore.FieldValue.serverTimestamp(), status: "sold" }, { merge: true });
        }
        // TODO: send email notifications to all users
        // TODO: create chat room and contract for buyer and seller
        for (const highestBid of highestBids) {
            const adId = highestBid.data().adId;
            const chatroomId = `${adId}_${Math.random().toString(36).substring(2, 15)}`;
            const contractId = `${adId}_${Math.random().toString(36).substring(2, 15)}`;
            const adRef = admin.firestore().collectionGroup("ads").where("id", "==", adId);
            const ad = await adRef.get();
            if (ad.empty) {
                throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
            }
            const sellerId = ad.docs[0].data().uid;
            const buyerId = highestBid.data().buyerId;
            const chatRoomData = {
                id: chatroomId,
                adId: adId,
                sellerId: sellerId,
                buyerId: buyerId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            const contractData = {
                id: contractId,
                adId: adId,
                sellerId: sellerId,
                buyerId: buyerId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "pending",
                endedAt: "",
                ready: [],
            };
            logger.info("terminateBidSession", "chatRoomData", chatRoomData);
            await admin.firestore().collection("chatrooms").doc(chatroomId).set(chatRoomData);
            logger.info("terminateBidSession", "contractData", contractData);
            await admin.firestore().collection("contracts").doc(contractId).set(contractData);
        }
        logger.info("terminateBidSession", "success");
    }
);

export const createTransaction = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    // if (!request.data) {
    //     throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    // }
    try {
        // const response = await new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve({ ...request.data, id: "1234567890" });
        //     }
        // , 1000);
        // });
        const authB64 = Buffer.from(`${process.env.ESCROW_EMAIL}:${process.env.ESCROW_API_KEY}`).toString("base64");
        axios.defaults.headers.common["Authorization"] = `Bearer ${authB64}`;
        const response = await axios.post(process.env.ESCROW_API_PAY_URL as string, {
            "currency": "usd",
            "description": "Perfect sedan for the snow",
            "reference": "test-transact",
            "return_url": "https://www.escrow.com",
            "redirect_type": "manual",
            "items": [
                {
                    "extra_attributes": {
                        "make": "BMW",
                        "model": "328xi",
                        "year": "2008",
                    },
                    "fees": [
                        {
                            "payer_customer": "me",
                            "split": "1",
                            "type": "escrow",
                        },
                    ],
                    "inspection_period": 259200,
                    "quantity": 1,
                    "schedule": [
                        {
                            "amount": 8000,
                            "payer_customer": "john.wick@test.escrow.com",
                            "beneficiary_customer": "me",
                        },
                    ],
                    "title": "BMW 328xi",
                    "type": "motor_vehicle",
                },
            ],
            "parties": [
                {
                    "address": {
                        "line1": "180 Montgomery St",
                        "line2": "Suite 650",
                        "city": "San Francisco",
                        "state": "CA",
                        "country": "US",
                        "post_code": "94104",
                    },
                    "agreed": true,
                    "customer": "john.wick@test.escrow.com",
                    "date_of_birth": "1980-07-18",
                    "first_name": "John",
                    "initiator": false,
                    "last_name": "Wick",
                    "phone_number": "4155555555",
                    "lock_email": true,
                    "role": "buyer",
                },
                {
                    "agreed": true,
                    "customer": "me",
                    "initiator": true,
                    "role": "seller",
                },
            ],
        });
        return response.data;
    } catch (error) {
        logger.error("Error creating transaction:", error);
        return error;
    }
});
export const createEscrowAccount = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.auth.token.email_verified) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.auth.uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        type Response = {
            id: string;
            status: string;
        };
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...request.data, id: "1234567890", status: "success" });
            }
        , 1000);
        }) as Response;
        if (response && response.status === "success") {
            // update user profile
            const uid = request.auth.uid;
            await admin.firestore().collection("users").doc(uid).set({ escrowAccountId: response.id, hasEscrow: true }, { merge: true });
            return response;
        } else {
            throw new HttpsError("internal", ERROR_CODES["internal"]);
        }
    } catch (error) {
        logger.error("Error creating transaction:", error);
        return error;
    }
});
export const linkEscrowAccount = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    logger.info("linkEscrowAccount token", request.auth.token);
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.auth.token.email_verified) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.auth.uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        type Response = {
            status: string;
        };
        // TODO - get escrow account with creds, then update user profile
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "success" });
            }
        , 1000);
        }) as Response;
        if (response && response.status === "success") {
            // update user profile
            const uid = request.auth.uid;
            await admin.firestore().collection("users").doc(uid).set({ escrowAuth: { ...request.data }, hasEscrow: true }, { merge: true });
            return response;
        } else {
            throw new HttpsError("internal", ERROR_CODES["internal"]);
        }
    } catch (error) {
        logger.error("Error creating transaction:", error);
        return error;
    }
});
