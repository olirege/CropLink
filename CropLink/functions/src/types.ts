import { Timestamp } from "@firebase/firestore";
export type Ad = {
    uid?: string;
    id?: string;
    type: string;
    adType: string;
    yieldTonnage: number;
    price: number;
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
    images?: string[];
    resizedImages?: string[];
    updatedAt?: string;
    status?: string;
    endedAt?: string;
};
export type SellerAd = {
    uid?: string;
    id?: string;
    adType: string;
    type: string;
    variety: string;
    yieldTonnage: number;
    expectedHarvestDate: string;
    price: number;
    images: string[];
    resizedImages: string[];
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
    expiryDate?: string;
    updatedAt?: string;
    status?: string;
    endedAt?: string;
};
export type BuyerAd = {
    uid?: string;
    id?: string;
    adType: string;
    type: string;
    yieldTonnage: number;
    requestDate: string;
    price: number;
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
    updatedAt?: string;
    status?: string;
    endedAt?: string;
};
export type Bid = {
    id?: string;
    buyerId: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    endedAt: Date;
};
export type ChatRoom = {
    id: string,
    adId: string,
    sellerId: string,
    buyerId: string,
    createdAt: Date,
    lastMessage?: string,
    lastMessageAt?: Date,
    unreadCount?:number,
};
export type Message = {
    senderId:string,
    text:string,
    createdAt:Date,
    read:boolean,
};
export type Clause = {
    id: string;
    text: string;
    draft: boolean;
    state: "pending" | "accepted" | "rejected";
    createdAt: Timestamp;
    authorId: string;
    updatedAt: Timestamp;
};
export type Contract = {
    id: string;
    adId: string,
    sellerId: string,
    buyerId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    status: "pending" | "accepted" | "rejected",
    endedAt?: Timestamp,
};
