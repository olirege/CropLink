import { onCall, HttpsError, CallableOptions, CallableRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getStorage } from "firebase-admin/storage";
import { MemoryOption } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { ERROR_CODES } from "./errors";
import { deleteFileFromBucket, generateTransaction } from "./utils";
import type { Ad, Contract, Transaction, Gig } from "./types";
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
            await admin.firestore().collection("ads").doc(uid).set({ id: uid, createdAt: admin.firestore.FieldValue.serverTimestamp(), samples: [], name: request.data.name });
            return request.data;
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});
export const updateProfile = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("updateProfile", request);
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
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const BUCKET_PREFIX = process.env.BUCKETURL;
        const profilePicSignedUrls = [];
        const profilePicResizedSignedUrls = [];
        const bannerPicSignedUrls = [];
        const bannerPicResizedSignedUrls = [];
        const bucket = getStorage().bucket();
        if ( request.data.profilePic && request.data.profilePic.length > 0) {
            const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const filename = `${imageId}.jpg`;
            const bucketPath= `${`users/${uid}/` + filename}`;
            const file = bucket.file(bucketPath);
            const base64EncodedImageString = request.data.profilePic.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
            await file.save(imageBuffer, { contentType: "image/jpeg" });
            const imagePath = `${BUCKET_PREFIX + `users/${uid}/` + filename}`;
            const _imageUrl = new URL(imagePath);
            const imageUrl = _imageUrl.pathname.substring(1);
            const imageRef = bucket.file(imageUrl);
            const [signedUrl] = await imageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            profilePicSignedUrls.push(signedUrl);
            const resizedImageFilename = `${imageId}_resized.jpg`;
            const resizedImageBucketPath= `${`users/${uid}/` + resizedImageFilename}`;
            const resizedImageFile = bucket.file(resizedImageBucketPath);
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize(256, 256, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0 },
            })
            .jpeg()
            .toBuffer();
            await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
            const resizedImagePath = `${BUCKET_PREFIX + `users/${uid}/` + resizedImageFilename}`;
            const _resizedImageUrl = new URL(resizedImagePath);
            const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
            const resizedImageRef = bucket.file(resizedImageUrl);
            const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            profilePicResizedSignedUrls.push(resizedSignedUrl);
        }
        if ( request.data.bannerPic && request.data.bannerPic.length > 0) {
            const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const filename = `${imageId}.jpg`;
            const bucketPath= `${`users/${uid}/` + filename}`;
            const file = bucket.file(bucketPath);
            const base64EncodedImageString = request.data.bannerPic.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
            await file.save(imageBuffer, { contentType: "image/jpeg" });
            const imagePath = `${BUCKET_PREFIX + `users/${uid}/` + filename}`;
            const _imageUrl = new URL(imagePath);
            const imageUrl = _imageUrl.pathname.substring(1);
            const imageRef = bucket.file(imageUrl);
            const [signedUrl] = await imageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            bannerPicSignedUrls.push(signedUrl);
            const resizedImageFilename = `${imageId}_resized.jpg`;
            const resizedImageBucketPath= `${`users/${uid}/` + resizedImageFilename}`;
            const resizedImageFile = bucket.file(resizedImageBucketPath);
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize(1024, 616, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0 },
            })
            .jpeg()
            .toBuffer();
            await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
            const resizedImagePath = `${BUCKET_PREFIX + `users/${uid}/` + resizedImageFilename}`;
            const _resizedImageUrl = new URL(resizedImagePath);
            const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
            const resizedImageRef = bucket.file(resizedImageUrl);
            const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            bannerPicResizedSignedUrls.push(resizedSignedUrl);
        }
        const images: { [key: string]: string } = {
            profilePic: profilePicSignedUrls[0] ? profilePicSignedUrls[0] : "",
            profilePicResized: profilePicResizedSignedUrls[0] ? profilePicResizedSignedUrls[0] : "",
            bannerPic: bannerPicSignedUrls[0] ? bannerPicSignedUrls[0] : "",
            bannerPicResized: bannerPicResizedSignedUrls[0] ? bannerPicResizedSignedUrls[0] : "",
        };
        for (const key in images) {
            if (images[key] == "") {
                delete images[key];
            }
        }
        const profile = {
            ...request.data,
            ...images,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        logger.info("updateProfile", "profile", profile);
        await admin.firestore().collection("users").doc(uid).set(profile, { merge: true });
        logger.info("updateProfile", "success");
        await admin.firestore().collection("ads").doc(uid).set({
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
           ...images,
        }, { merge: true });
        logger.info("updateProfile", "success");
        return profile;
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const updateStoreChanges = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const adRef = admin.firestore().collection("ads").doc(uid);
        const adDoc = await adRef.get();
        if (!adDoc.exists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const ad = adDoc.data();
        const BUCKET_PREFIX = process.env.BUCKETURL;
        const logoSignedUrls = [];
        const logoResizedSignedUrls = [];
        const storeBannerPicSignedUrls = [];
        const storeBannerPicResizedSignedUrls = [];
        const newStoreImagesSignedUrls = [];
        const newStoreImagesResizedSignedUrls = [];
        const bucket = getStorage().bucket();
        if (ad?.storeImagesResized && ad?.storeImagesResized.length > 0) {
            const resizedImagesToDelete = ad?.storeImagesResized.filter((image:string) => !request.data.storeImagesResized.includes(image));
            const originalImagesToDelete = resizedImagesToDelete.map((image:string) => {
                const resizedImageNameWithoutResized = image.replace("_resized", "");
                return resizedImageNameWithoutResized;
            });
            for (const image of resizedImagesToDelete) {
                await deleteFileFromBucket(image, bucket, BUCKET_PREFIX as string);
            }
            for (const image of originalImagesToDelete) {
                await deleteFileFromBucket(image, bucket, BUCKET_PREFIX as string);
            }
        }
        if (request.data.storeImagesResized && request.data.storeImagesResized.length > 0) {
            request.data.storeImages = request.data.storeImagesResized.map((image:string) => {
                const originalImageNameWithoutResized = image.replace("_resized", "");
                return originalImageNameWithoutResized;
            });
        }
        if (request.data.newStoreImages && request.data.newStoreImages.length > 0) {
            for (const image of request.data.newStoreImages) {
                const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const filename = `${imageId}.jpg`;
                const bucketPath= `${`users/${uid}/` + filename}`;
                const file = bucket.file(bucketPath);
                const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "");
                const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
                await file.save(imageBuffer, { contentType: "image/jpeg" });
                const imagePath = `${BUCKET_PREFIX + `users/${uid}/` + filename}`;
                const _imageUrl = new URL(imagePath);
                const imageUrl = _imageUrl.pathname.substring(1);
                const imageRef = bucket.file(imageUrl);
                const [signedUrl] = await imageRef.getSignedUrl({
                    action: "read",
                    expires: "03-17-2030",
                });
                newStoreImagesSignedUrls.push(signedUrl);
                const resizedImageFilename = `${imageId}_resized.jpg`;
                const resizedImageBucketPath= `${`users/${uid}/` + resizedImageFilename}`;
                const resizedImageFile = bucket.file(resizedImageBucketPath);
                const resizedImageBuffer = await sharp(imageBuffer)
                .resize(500, 500, {
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 1 },
                })
                .jpeg()
                .toBuffer();
                await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
                const resizedImagePath = `${BUCKET_PREFIX + `users/${uid}/` + resizedImageFilename}`;
                const _resizedImageUrl = new URL(resizedImagePath);
                const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
                const resizedImageRef = bucket.file(resizedImageUrl);
                const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                    action: "read",
                    expires: "03-17-2030",
                });
                newStoreImagesResizedSignedUrls.push(resizedSignedUrl);
            }
            delete request.data.newStoreImages;
        }
        if ( request.data.storeLogo && request.data.storeLogo.length > 0) {
            logger.info("updateStoreChanges", "request.data.storeLogo", request.data.storeLogo);
            const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const filename = `${imageId}.jpg`;
            const bucketPath= `${`users/${uid}/` + filename}`;
            const file = bucket.file(bucketPath);
            const base64EncodedImageString = request.data.storeLogo.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
            await file.save(imageBuffer, { contentType: "image/jpeg" });
            const imagePath = `${BUCKET_PREFIX + `users/${uid}/` + filename}`;
            const _imageUrl = new URL(imagePath);
            const imageUrl = _imageUrl.pathname.substring(1);
            const imageRef = bucket.file(imageUrl);
            const [signedUrl] = await imageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            logoSignedUrls.push(signedUrl);
            const resizedImageFilename = `${imageId}_resized.jpg`;
            const resizedImageBucketPath= `${`users/${uid}/` + resizedImageFilename}`;
            const resizedImageFile = bucket.file(resizedImageBucketPath);
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize(256, 256, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0 },
            })
            .jpeg()
            .toBuffer();
            await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
            const resizedImagePath = `${BUCKET_PREFIX + `users/${uid}/` + resizedImageFilename}`;
            const _resizedImageUrl = new URL(resizedImagePath);
            const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
            const resizedImageRef = bucket.file(resizedImageUrl);
            const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            logoResizedSignedUrls.push(resizedSignedUrl);
        }
        if ( request.data.storeBannerPic && request.data.storeBannerPic.length > 0) {
            const imageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const filename = `${imageId}.jpg`;
            const bucketPath= `${`users/${uid}/` + filename}`;
            const file = bucket.file(bucketPath);
            const base64EncodedImageString = request.data.storeBannerPic.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64EncodedImageString, "base64");
            await file.save(imageBuffer, { contentType: "image/jpeg" });
            const imagePath = `${BUCKET_PREFIX + `users/${uid}/` + filename}`;
            const _imageUrl = new URL(imagePath);
            const imageUrl = _imageUrl.pathname.substring(1);
            const imageRef = bucket.file(imageUrl);
            const [signedUrl] = await imageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            storeBannerPicSignedUrls.push(signedUrl);
            const resizedImageFilename = `${imageId}_resized.jpg`;
            const resizedImageBucketPath= `${`users/${uid}/` + resizedImageFilename}`;
            const resizedImageFile = bucket.file(resizedImageBucketPath);
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize(1024, 616, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0 },
            })
            .jpeg()
            .toBuffer();
            await resizedImageFile.save(resizedImageBuffer, { contentType: "image/jpeg" });
            const resizedImagePath = `${BUCKET_PREFIX + `users/${uid}/` + resizedImageFilename}`;
            const _resizedImageUrl = new URL(resizedImagePath);
            const resizedImageUrl = _resizedImageUrl.pathname.substring(1);
            const resizedImageRef = bucket.file(resizedImageUrl);
            const [resizedSignedUrl] = await resizedImageRef.getSignedUrl({
                action: "read",
                expires: "03-17-2030",
            });
            storeBannerPicResizedSignedUrls.push(resizedSignedUrl);
        }
        request.data.storeImages ? request.data.storeImages = [...request.data.storeImages, ...newStoreImagesSignedUrls] : request.data.storeImages = [...newStoreImagesSignedUrls];
        request.data.storeImagesResized ? request.data.storeImagesResized = [...request.data.storeImagesResized, ...newStoreImagesResizedSignedUrls] : request.data.storeImagesResized = [...newStoreImagesResizedSignedUrls];
        const changes = {
            ...request.data,
            storeLogo: logoSignedUrls[0] ? logoSignedUrls[0] : "",
            storeLogoResized: logoResizedSignedUrls[0] ? logoResizedSignedUrls[0] : "",
            storeBannerPic: storeBannerPicSignedUrls[0] ? storeBannerPicSignedUrls[0] : "",
            storeBannerPicResized: storeBannerPicResizedSignedUrls[0] ? storeBannerPicResizedSignedUrls[0] : "",
        };
        for (const key in changes) {
            if (changes[key] === "") {
                delete changes[key];
            }
        }
        await admin.firestore().collection("ads").doc(uid).set({
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...changes,
        }, { merge: true });
        logger.info("updateStore", "success");
        return changes;
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
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
                    await deleteFileFromBucket(image, bucket, BUCKET_PREFIX);
                }
                for (const image of originalImagesToDelete) {
                    await deleteFileFromBucket(image, bucket, BUCKET_PREFIX);
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
    const adRef = admin.firestore().collection("ads").doc(uid);
    const adGroupRef = admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId);
    const adGroupDoc = await adGroupRef.get();
    if (!adGroupDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adGroup = adGroupDoc.data() as Ad;
    if (adGroup.live) {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-already-live"]);
    } else {
        try {
            if (adGroup.adType === "seller" && adGroup.resizedImages && adGroup.resizedImages.length > 0 && adGroup.variety) {
                await adRef.set({ samples: admin.firestore.FieldValue.arrayUnion({ name: adGroup.variety, image: adGroup.resizedImages[0], adId: adId }) }, { merge: true });
            }
            await adGroupRef.set({ live: true, postedOn: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
            return { success: true };
        } catch (error:any) {
            logger.error(error);
            throw new HttpsError("internal", error);
        }
    }
});
export const takedownAd = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("takedownAd", request);
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
    const adRef = admin.firestore().collection("ads").doc(uid);
    const adGroupRef = admin.firestore().collection("ads").doc(uid).collection("ads").doc(adId);
    const adGroupDoc = await adGroupRef.get();
    if (!adGroupDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const adGroup = adGroupDoc.data() as Ad;
    if (!adGroup.live) {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-already-not-live"]);
    } else {
        try {
            if (adGroup.adType === "seller" && adGroup.resizedImages && adGroup.resizedImages.length > 0 && adGroup.variety) {
                await adRef.set({ samples: admin.firestore.FieldValue.arrayRemove({ name: adGroup.variety, image: adGroup.resizedImages[0], adId: adId }) }, { merge: true });
            }
            await adGroupRef.set({ live: false, postedOn: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
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
    const adDoc = await adRef.get();
    const ad = adDoc.docs[0].data() as Ad;
    if (!adDoc.docs[0].exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-not-live"]);
    } else if (ad.adType === "buyer") {
        throw new HttpsError("invalid-argument", ERROR_CODES["ad-not-seller"]);
    }
    const sellerId = ad.uid;
    try {
        const bidId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const bid = {
            adId: adId,
            sellerId: sellerId,
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
                await ad.ref.set({ highestBid: { bidId: highestBid.data().id, price: highestBid.data().price, buyerId: highestBid.data().buyerId } }, { merge: true });
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
            const buyerRef = admin.firestore().collection("users").doc(buyerId);
            const buyerDoc = await buyerRef.get();
            if (!buyerDoc.exists) {
                throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
            }
            const buyerData = buyerDoc.data();
            const userSignature = {
                name: buyerData?.name,
                profilePic: buyerData?.profilePicResized,
            };
            const contractData = {
                id: contractId,
                adId: adId,
                type: "sell",
                sellerId: sellerId,
                buyerId: buyerId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "pending",
                endedAt: "",
                ready: [],
                userSignature: userSignature,
            };
            logger.info("terminateBidSession", "chatRoomData", chatRoomData);
            await admin.firestore().collection("chatrooms").doc(chatroomId).set(chatRoomData);
            logger.info("terminateBidSession", "contractData", contractData);
            await admin.firestore().collection("contracts").doc(contractId).set(contractData);
        }
        logger.info("terminateBidSession", "success");
    }
);
export const initializeChatAndContract = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("initializeChatAndContract", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data || !request.data.contractType) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    let contextData;
    if (request.data.contractType == "gig" && request.data.adId) {
        const adRef = admin.firestore().collectionGroup("gigs").where("gigId", "==", request.data.adId);
        const adDocs = await adRef.get();
        if (adDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        contextData = adDocs.docs[0].data();
    }
    const adId = request.data.adId;
    const contractId = `${adId}_${Math.random().toString(36).substring(2, 15)}`;
    const chatroomId = `${adId}_${Math.random().toString(36).substring(2, 15)}`;
    const chatRoomData = {
        id: chatroomId,
        adId: adId,
        sellerId: request.data.sellerId,
        buyerId: request.data.buyerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const contractData = {
        id: contractId,
        adId: adId,
        type: request.data.contractType,
        sellerId: request.data.sellerId,
        buyerId: request.data.buyerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
        endedAt: "",
        ready: [],
        context: contextData,
        userSignature: {
            name: "",
            profilePic: "",
        },
    };
    const otherUserId = request.data.sellerId === uid ? request.data.buyerId : request.data.sellerId;
    const otherUserRef = admin.firestore().collection("users").doc(otherUserId);
    const otherUserRefDoc = await otherUserRef.get();
    if (!otherUserRefDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const otherUserRefData = otherUserRefDoc.data();
    contractData.userSignature.name = otherUserRefData?.name;
    contractData.userSignature.profilePic = otherUserRefData?.profilePicResized;
    const participants = [request.data.sellerId, request.data.buyerId].sort();
    const participantKey = participants.join("_");
    logger.info("initializeChatAndContract", "participants", participants, "participantKey", participantKey);
    const dmRef = admin.firestore().collection("dms").where("participantKey", "==", participantKey);
    logger.info("initializeChatAndContract", "dmRef", dmRef);
    const dmDoc = await dmRef.get();
    let dmMeta;
    if (!dmDoc.empty) {
        dmMeta = dmDoc.docs[0].data();
    } else {
        logger.info("no existing chat");
        dmMeta = {
            dmId: "",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            senderProfilePic: "",
            senderId: "",
            context: {},
            participants: ([] as string[]),
            participantKey: "",
            lastMessage: "",
            lastSender: "",
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        };
        const userRef = admin.firestore().collection("users").doc(request.auth.uid);
        const userDoc = await userRef.get();
        logger.info("userDoc", userDoc);
        if (!userDoc.exists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const userData = userDoc.data();
        if (!userData) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        if (userData.profilePic) {
            dmMeta.senderProfilePic = userData.profilePic;
        }
        dmMeta.senderId = request.auth.uid;
        dmMeta.participants = participants;
        dmMeta.participantKey = participantKey;
        dmMeta.dmId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        logger.info("setting dmMeta", dmMeta);
        await admin.firestore().collection("dms").doc(dmMeta.dmId).set(dmMeta);
    }
    const messageMeta = {
        senderId: request.auth.uid,
        text: "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        context: {
            __key: "invitation",
            invitation: {
                adId: adId,
                contractId: contractId,
                chatroomId: chatroomId,
            },
        },
    };
    logger.info("initializeChatAndContract", "dmMeta", dmMeta, "messageMeta", messageMeta);
    await admin.firestore().collection("dms").doc(dmMeta.dmId).collection("messages").add(messageMeta);
    logger.info("initializeChatAndContract", "chatRoomData", chatRoomData);
    await admin.firestore().collection("chatrooms").doc(chatroomId).set(chatRoomData);
    logger.info("initializeChatAndContract", "contractData", contractData);
    await admin.firestore().collection("contracts").doc(contractId).set(contractData);
    return { adId, chatroomId, contractId };
});

export const createTransaction = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("createTransaction", request.data);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data.adId || !request.data.contractId) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    try {
        logger.info("createTransaction try", request.data);
        const contractId = request.data.contractId;
        // check if transaction already exists
        const transactionRef = admin.firestore().collection("transactions").doc(contractId);
        const transactionDoc = await transactionRef.get();
        if (transactionDoc.exists) {
            const transactionData = transactionDoc.data();
            if (transactionData?.landing_page) {
                return { landingPage: transactionData.landing_page, transactionId: transactionData.transaction_id };
            } else {
                throw new HttpsError("invalid-argument", ERROR_CODES["transaction-no-landing-page"]);
            }
        }
        logger.info("createTransaction contractId", contractId);
        const contractRef = admin.firestore().collection("contracts").where("id", "==", contractId);
        logger.info("createTransaction contractRef", contractRef);
        const contractDocs = await contractRef.get();
        logger.info("createTransaction contractDocs", contractDocs);
        if (contractDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["contract-does-not-exist"]);
        }
        logger.info("createTransaction contractDocs", contractDocs);
        const contractData = contractDocs.docs[0].data();
        logger.info("createTransaction contractData", contractData);
        if (contractData.ready.length < 2) {
            throw new HttpsError("invalid-argument", ERROR_CODES["parties-not-ready"]);
        }
        let adRef;
        if (contractData.type == "sell") {
            adRef = admin.firestore().collectionGroup("ads").where("id", "==", request.data.adId);
        } else if (contractData.type == "gig") {
            adRef = admin.firestore().collectionGroup("gigs").where("gigId", "==", request.data.adId);
        } else {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const adDocs = await adRef.get();
        if (adDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        logger.info("createTransaction adRef", adRef);
        const adData = adDocs.docs[0].data();
        logger.info("createTransaction adData", adData);
        const sellerRef = admin.firestore().collection("users").doc(contractData.sellerId);
        const sellerDoc = await sellerRef.get();
        if (!sellerDoc.exists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["user-does-not-exist"]);
        }
        const sellerData = sellerDoc.data();
        logger.info("createTransaction sellerRef", sellerData);
        const buyerRef = admin.firestore().collection("users").doc(contractData.buyerId);
        const buyerDoc = await buyerRef.get();
        if (!buyerDoc.exists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["user-does-not-exist"]);
        }
        const buyerData = buyerDoc.data();
        logger.info("createTransaction buyerRef", buyerData);
        if (!sellerData?.hasEscrow || !buyerData?.hasEscrow) {
            throw new HttpsError("invalid-argument", ERROR_CODES["user-does-not-have-escrow-account"]);
        }
        const sellerEmail = sellerData?.escrowAuth.email;
        logger.info("createTransaction sellerEmail", sellerEmail);
        const buyerEmail = buyerData?.escrowAuth.email;
        logger.info("createTransaction buyerEmail", buyerEmail);
        if (!sellerEmail || !buyerEmail) {
            throw new HttpsError("invalid-argument", ERROR_CODES["user-does-not-have-escrow-account"]);
        }
        const escrowPayload = generateTransaction({
            contractData: contractData as Contract,
            adData: adData as Ad,
            sellerEmail,
            buyerEmail,
        });
        logger.info("createTransaction escrowPayload", escrowPayload);
        const authB64 = Buffer.from(`${process.env.ESCROW_EMAIL}:${process.env.ESCROW_API_KEY}`).toString("base64");
        axios.defaults.headers.common["Authorization"] = `Basic  ${authB64}`;
        logger.info("createTransaction b4 response");
        const response = await axios.post(process.env.ESCROW_API_PAY_URL as string, escrowPayload, { maxContentLength: 30 * 1024 * 1024, maxBodyLength: 30 * 1024 * 1024 });
        logger.info("createTransaction af response");
        if (response.data) {
            const transactionRef = admin.firestore().collection("transactions").doc(request.data.contractId);
            logger.info("createTransaction transactionRef", transactionRef);
            await transactionRef.set({ ...response.data, ...escrowPayload, sellerId: contractData.sellerId, buyerId: contractData.buyerId, createdAt: admin.firestore.FieldValue.serverTimestamp(), contractId: contractData.id });
            return { landingPage: response.data.landing_page, transactionId: response.data.id };
        } else {
            throw new HttpsError("internal", ERROR_CODES["internal"]);
        }
    } catch (error:any) {
        logger.log("Error creating transaction:", error);
        logger.log("Error creating transaction:", error.response.data);
        return { error };
    }
});
export const getTransaction = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const contractId = request.data.transactionId;
    if (!contractId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const transactionRef = admin.firestore().collection("transactions").doc(contractId);
        const transactionDoc = await transactionRef.get();
        if (transactionDoc.exists) {
            const transactionData = transactionDoc.data() as Transaction;
            const uid = request.auth.uid;
            if (transactionData?.sellerId !== uid && transactionData?.buyerId !== uid) {
                throw new HttpsError("invalid-argument", ERROR_CODES["permission-denied"]);
            } else {
                const authB64 = Buffer.from(`${process.env.ESCROW_EMAIL}:${process.env.ESCROW_API_KEY}`).toString("base64");
                axios.defaults.headers.common["Authorization"] = `Basic  ${authB64}`;
                logger.info("getTransaction transactionData", transactionData);
                const response = await axios.get(`${process.env.ESCROW_API_GETTRANSACTION_URL}${transactionData.transaction_id}` as string);
                logger.info("getTransaction response", response);
                if (response.status == 200) {
                    transactionRef.set({ ...response.data }, { merge: true });
                    return { transaction: response.data, landingPage: transactionData.landing_page };
                } else {
                    throw new HttpsError("internal", ERROR_CODES["internal"]);
                }
            }
        } else {
            throw new HttpsError("invalid-argument", ERROR_CODES["transaction-does-not-exist"]);
        }
    } catch (error:any) {
        logger.log("Error getting transaction:", error.response.data);
        return { error };
    }
});

export const getEscrowLandingPage = onCall(callableOptions, async (request:CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const transactionId = request.data.transactionId;
    if (!transactionId) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const transactionRef = admin.firestore().collection("transactions").doc(transactionId);
        const transactionDoc = await transactionRef.get();
        if (transactionDoc.exists) {
            const transactionData = transactionDoc.data();
            const uid = request.auth.uid;
            if (transactionData?.sellerId !== uid && transactionData?.buyerId !== uid) {
                throw new HttpsError("invalid-argument", ERROR_CODES["permission-denied"]);
            } else {
                if (transactionData?.landing_page) {
                    return { landingPage: transactionData.landing_page, transactionId: transactionData.id };
                } else {
                    throw new HttpsError("invalid-argument", ERROR_CODES["transaction-no-landing-page"]);
                }
            }
        } else {
            throw new HttpsError("invalid-argument", ERROR_CODES["transaction-does-not-exist"]);
        }
    } catch (error:any) {
        logger.log("Error getting transaction:", error);
        return { error };
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
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "success" });
            }
        , 1000);
        }) as Response;
        if (response && response.status === "success") {
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
export const createJobPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("createJob", request);
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
        const jobId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await admin.firestore().collection("jobs").doc(uid).collection("jobs").doc(jobId).set({ ...request.data, jobId: jobId, createdAt: admin.firestore.FieldValue.serverTimestamp(), posterId: uid, live: false });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const postJobPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("postJobPost", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        await admin.firestore().collection("jobs").doc(uid).collection("jobs").doc(request.data.jobId).set({ live: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const takeDownJobPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("takeDownJobPost", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        await admin.firestore().collection("jobs").doc(uid).collection("jobs").doc(request.data.jobId).set({ live: false, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const editJobPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("editJobPost", request);
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
        await admin.firestore().collection("jobs").doc(uid).collection("jobs").doc(request.data.jobId).set({ ...request.data.changes, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const removeJobPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("removeJobPost", request);
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
        await admin.firestore().collection("jobs").doc(uid).collection("jobs").doc(request.data.jobId).delete();
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const createGigPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("createGig", request);
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
        const gigId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let total = 0;
        const gig = request.data as Gig;
        for ( const milestone of gig.milestones) {
            total += milestone.price;
        }
        await admin.firestore().collection("gigs").doc(uid).collection("gigs").doc(gigId).set({ ...request.data, total, gigId: gigId, createdAt: admin.firestore.FieldValue.serverTimestamp(), posterId: uid, live: false });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const postGigPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("postGigPost", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        await admin.firestore().collection("gigs").doc(uid).collection("gigs").doc(request.data.gigId).set({ live: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const takeDownGigPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("takeDownGigPost", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        await admin.firestore().collection("gigs").doc(uid).collection("gigs").doc(request.data.gigId).set({ live: false, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const editGigPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("editGigPost", request);
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
        await admin.firestore().collection("gigs").doc(uid).collection("gigs").doc(request.data.gigId).set({ ...request.data.changes, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const removeGigPost = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("removeGigPost", request);
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
        await admin.firestore().collection("gigs").doc(uid).collection("gigs").doc(request.data.gigId).delete();
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const updateLastMessage = onDocumentCreated("/chatrooms/{chatroomId}/messages/{messageId}", (event) => {
    const chatroomId = event.params.chatroomId;
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }
    const messageData = snapshot.data();
    const chatroomUpdate = {
        lastMessage: messageData.text,
        lastSender: messageData.senderId,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        lastContext: messageData.context && Object.keys(messageData.context).length > 0 ? messageData.context : null,
    };
    return admin.firestore().collection("chatrooms").doc(chatroomId)
        .update(chatroomUpdate)
        .catch( (error) => {
            logger.error("Error updating chatroom: ", error);
        });
});
export const initiateDm = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("initiateDm", request);
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
    if (!request.data.participants) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const dmMeta = {
        dmId: "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        senderProfilePic: "",
        senderId: "",
        context: {},
        participants: [],
        participantKey: "",
        lastMessage: "",
        lastSender: "",
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };
    const userRef = admin.firestore().collection("users").doc(request.data.senderId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    const userData = userDoc.data();
    if (!userData) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    if (userData.profilePic) {
        dmMeta.senderProfilePic = userData.profilePic;
    }
    dmMeta.senderId = request.data.senderId;
    dmMeta.participants = request.data.participants.sort();
    dmMeta.participantKey = request.data.participants.sort().join("_");
    dmMeta.dmId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const messageMeta = {
        senderId: request.data.senderId,
        text: request.data.text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        context: request.data.context ? request.data.context : {},
    };
    await admin.firestore().collection("dms").doc(dmMeta.dmId).set(dmMeta);
    await admin.firestore().collection("dms").doc(dmMeta.dmId).collection("messages").add(messageMeta);
    return dmMeta;
});

export const updateLastDm = onDocumentCreated("/dms/{dmId}/messages/{messageId}", (event) => {
    const dmId = event.params.dmId;
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }
    const messageData = snapshot.data();
    const dmUpdate = {
        lastMessage: messageData.text,
        lastSender: messageData.senderId,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        lastContext: messageData.context && Object.keys(messageData.context).length > 0 ? messageData.context : null,
    };
    return admin.firestore().collection("dms").doc(dmId)
        .update(dmUpdate)
        .catch( (error) => {
            logger.error("Error updating dms: ", error);
    });
});
export const submitApplication = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("submitApplication", request);
    if (!request.auth) {
        throw new HttpsError("unauthenticated", ERROR_CODES["unauthenticated"]);
    }
    const uid = request.auth.uid;
    if (!uid) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }

    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const resume = request.data.resume;
        if (!resume) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const bucket = admin.storage().bucket();
        const file = bucket.file(resume);
        const fileExists = await file.exists();
        if (!fileExists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const [url] = await file.getSignedUrl({ action: "read", expires: "03-09-2491" });
        const applicationId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        delete request.data.resume;
        const applicationData = {
            ...request.data,
            resume: url,
            applicationId: applicationId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "pending",
            applicantId: uid,
        };
        await admin.firestore().collection("applications").doc(applicationId).set(applicationData);
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const removeApplication = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("removeApplication", request);
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
        const applicationId = request.data.applicationId;
        const appRef = admin.firestore().collection("applications").doc(applicationId);
        const appDoc = await appRef.get();
        if (!appDoc.exists) {
            throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
        }
        const appData = appDoc.data();
        if ( appData && appData.resume ) {
            const bucket = admin.storage().bucket();
            const BUCKET_PREFIX = process.env.BUCKETPARSEDURL as string;
            try {
                await deleteFileFromBucket(appData?.resume, bucket, BUCKET_PREFIX);
            } catch (error) {
                logger.error(error);
            }
        }
        await appRef.delete();
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const increaseAdViewCount = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("increaseAdViewCount", request);
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const adId = request.data.adId;
        const adRef = admin.firestore().collectionGroup("ads").where("id", "==", adId);
        const adDocs = await adRef.get();
        if (adDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        const adData = adDocs.docs[0].data();
        const adViewCount = adData.viewCount ? adData.viewCount + 1 : 1;
        await admin.firestore().collection("ads").doc(adData.uid).collection("ads").doc(adId).set({ viewCount: adViewCount }, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const increaseSellerStoreViewCount = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("increaseSellerStoreViewCount", request);
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const sellerId = request.data.sellerId;
        const adRef = admin.firestore().collection("ads").where("id", "==", sellerId);
        const adDocs = await adRef.get();
        if (adDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        const adData = adDocs.docs[0].data();
        const adViewCount = adData.viewCount ? adData.viewCount + 1 : 1;
        await admin.firestore().collection("ads").doc(sellerId).set({ viewCount: adViewCount }, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const increaseGigViewCount = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("increaseGigViewCount", request);
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const gigId = request.data.gigId;
        const gigRef = admin.firestore().collectionGroup("gigs").where("gigId", "==", gigId);
        const gigDocs = await gigRef.get();
        if (gigDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        const gigData = gigDocs.docs[0].data();
        const gigViewCount = gigData.viewCount ? gigData.viewCount + 1 : 1;
        await admin.firestore().collection("gigs").doc(gigData.posterId).collection("gigs").doc(gigId).set({ viewCount: gigViewCount }, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
export const increaseJobViewCount = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("increaseJobViewCount", request);
    if (!request.data) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
    try {
        const jobId = request.data.jobId;
        const jobRef = admin.firestore().collectionGroup("jobs").where("jobId", "==", jobId);
        const jobDocs = await jobRef.get();
        if (jobDocs.empty) {
            throw new HttpsError("invalid-argument", ERROR_CODES["ad-does-not-exist"]);
        }
        const jobData = jobDocs.docs[0].data();
        const jobViewCount = jobData.viewCount ? jobData.viewCount + 1 : 1;
        await admin.firestore().collection("jobs").doc(jobData.posterId).collection("jobs").doc(jobId).set({ viewCount: jobViewCount }, { merge: true });
        return { success: true };
    } catch (error:any) {
        logger.error(error);
        throw new HttpsError("internal", error);
    }
});
