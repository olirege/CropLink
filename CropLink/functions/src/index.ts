import { onCall, HttpsError, CallableOptions, CallableRequest } from "firebase-functions/v2/https";
import { MemoryOption } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { ERROR_CODES } from "./errors";
import { isAdmin } from "./utils";

const callableOptions: CallableOptions = {
    memory: "512MB" as MemoryOption,
    timeoutSeconds: 60,
    region: "northamerica-northeast1",
};

const initCheck = (request: CallableRequest, hasData = true) => {
    logger.info("initCheck", request.auth);
    if (!isAdmin(request)) {
        throw new HttpsError("permission-denied", ERROR_CODES["permission-denied"]);
    }
    if (!request.data && hasData) {
        throw new HttpsError("invalid-argument", ERROR_CODES["invalid-argument"]);
    }
};

export const setDocument = onCall(callableOptions, async (request:CallableRequest) => {
    logger.info("setDocument", request);
    initCheck(request);
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
