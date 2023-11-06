import { CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

export const isAdmin = (request: CallableRequest) => {
    return request.auth?.token.admin === true;
};

export const deleteImageFromBucket = async (image: string, bucket: any, BUCKET_PREFIX: string) => {
    const _imageUrl = new URL(image);
    let imageUrl = _imageUrl.pathname.substring(1);
    if (imageUrl.startsWith(BUCKET_PREFIX)) {
        imageUrl = imageUrl.replace(BUCKET_PREFIX, "");
    }
    const imageRef = bucket.file(imageUrl);
    await imageRef.delete();
};
export const sendEmailNotification = async (to: string, subject: string, body: string) => {
    logger.info("sendEmailNotification", to, subject, body);
    const id = await admin.firestore().collection("mail").add({
        to: to,
        message: {
            subject: subject,
            html: body,
        },
    });
    logger.info("sendEmailNotification done", id);
};
