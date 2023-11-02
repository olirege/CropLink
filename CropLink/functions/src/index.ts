import { onCall, HttpsError, CallableOptions, CallableRequest } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { MemoryOption } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { ERROR_CODES } from "./errors";
import { isAdmin } from "./utils";
import type { Ad } from "./types";
const service = require("../service/service.json");
admin.initializeApp({
    credential: admin.credential.cert(service as admin.ServiceAccount),
    storageBucket: "croplink-30e3c.appspot.com",
});
const callableOptions: CallableOptions = {
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
        const BUCKET_PREFIX = "gs://croplink-30e3c.appspot.com/";
        const adId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const signedUrls = [];
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
            }
        }
        logger.info(typeof request.data, JSON.stringify(request.data));
        const ad = {
            ...request.data,
            images: signedUrls,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            live: false,
        };
        await admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId).set(ad);
        return { id: adId, ...ad };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
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

