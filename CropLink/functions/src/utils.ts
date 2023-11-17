import { CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import type { TransactionPayload } from "./types";
export const isAdmin = (request: CallableRequest) => {
    return request.auth?.token.admin === true;
};

export const deleteFileFromBucket = async (file: string, bucket: any, BUCKET_PREFIX: string) => {
    const _fileUrl = new URL(file);
    let fileUrl = _fileUrl.pathname.substring(1);
    if (fileUrl.startsWith(BUCKET_PREFIX)) {
        fileUrl = fileUrl.replace(BUCKET_PREFIX, "");
    }
    const fileRef = bucket.file(fileUrl);
    await fileRef.delete();
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


export const generateTransaction = (payload: TransactionPayload) => {
    logger.info("generateTransaction", payload);
    if (!payload) {
        throw new Error("transaction-adId-missing");
    }
    const currency = "cad";
    const redirectUrl = `${process.env.TRANSACTION_DEV_URL}${payload.adData.id}/${payload.contractData.id}`;
    const variety = payload.adData.variety;
    const type = payload.adData.type;
    const yieldTonnage = payload.adData.yieldTonnage;
    const buyerEmail = payload.buyerEmail;
    const sellerEmail = payload.sellerEmail;
    const sellerAgreed = payload.contractData.ready?.includes(payload.contractData.sellerId);
    const buyerAgreed = payload.contractData.ready?.includes(payload.contractData.buyerId);
    const escrowFeeSplit = process.env.ESCROW_FEE_SPLIT as string;
    const escrowInspectPeriod = parseInt(process.env.ESCROW_INSPECT_PERIOD as string);
    const escrowTransactionType = process.env.ESCROW_TRANSACTION_TYPE as string;
    const escrowBrokerFeeRate = process.env.ESCROW_BROKER_FEE as string;
    const total = payload.contractData.total ? payload.contractData.total : 0;
    const escrowBrokerFee = Math.round(total * parseFloat(escrowBrokerFeeRate) * 100) / 100;
    const data = {
        "currency": currency,
        "description": `Sale of ${variety} ${type}`,
        "return_url": redirectUrl,
        "redirect_type": "manual",
        "items": [
            {
                "extra_attributes": {
                    "concierge": false,
                    "with_content": false,
                },
                "fees": [
                    {
                        "payer_customer": sellerEmail,
                        "split": escrowFeeSplit,
                        "type": "escrow",
                    },
                    {
                        "payer_customer": buyerEmail,
                        "split": escrowFeeSplit,
                        "type": "escrow",
                    },
                ],
                "inspection_period": escrowInspectPeriod,
                "shipping_type": "no_shipping",
                "quantity": 1,
                "schedule": [
                    {
                        "amount": total,
                        "payer_customer": buyerEmail,
                        "beneficiary_customer": sellerEmail,
                    },
                ],
                "title": `${variety} ${type}`,
                "type": escrowTransactionType,
                "description": `${variety} ${type} ${yieldTonnage}`,
            },
            {
                "schedule": [
                    {
                        "amount": escrowBrokerFee,
                        "beneficiary_customer": "me",
                        "payer_customer": sellerEmail,
                    },
                ],
                "type": "broker_fee",
            },
            {
                "schedule": [
                    {
                        "amount": escrowBrokerFee,
                        "beneficiary_customer": "me",
                        "payer_customer": buyerEmail,
                    },
                ],
                "type": "broker_fee",
            },
        ],
        "parties": [
            {
                "role": "broker",
                "customer": "me",
                "initiator": true,
                "agreed": true,
            },
            {
                "agreed": buyerAgreed,
                "customer": buyerEmail,
                "initiator": false,
                "lock_email": false,
                "role": "buyer",
            },
            {
                "agreed": sellerAgreed,
                "customer": sellerEmail,
                "initiator": false,
                "role": "seller",
            },
        ],
    };
    logger.info("generateTransaction done", data);
    return data;
};
