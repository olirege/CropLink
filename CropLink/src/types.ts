import { Timestamp } from "@firebase/firestore";
export type User = {
    [key: string]: any;
  };

export type Bid = {
    id?: string;
    buyerId: string;
    price: number;
    createdAt: Date;
    adId:string;
    updatedAt: Date;
    status: string;
    endedAt: Date;
};
export type SellerAd = {
    uid?: string;
    id?: string;
    type: string;
    variety: string;
    yieldTonnage: number;
    expectedHarvestDate: Date;
    price: number;
    images: string[];
    resizedImages: string[];
    live: boolean;
    postedOn?: string;
    createdAt: Date;
    adType: string;
    updatedAt?: string;
    biddingEndTime?: Date;
    status?: string;
    endedAt?: Date;
};
export type BuyerAd = {
    uid?: string;
    id?: string;
    type: string;
    yieldTonnage: number;
    requestDate: Date;
    price: number;
    live: boolean;
    postedOn?: string;
    createdAt: Date;
    adType: string;
    updatedAt?: string;
    status?: string;
    endedAt?: Date;
};
export type Profile = {
    name: string;
    accountType: string;
};
export type Clause = {
    id: string;
    text: string;
    draft: boolean;
    state: "pending" | "accepted" | "rejected";
};
export type Contract = {
    id: string;
    clauses: Clause[];
    adId: string,
    sellerId: string,
    buyerId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    status: "pending" | "accepted" | "rejected",
    endedAt?: Timestamp, 
};
export type ChatRoom = {
    id: string,
    adId: string,
    sellerId: string,
    buyerId: string,
    createdAt: Timestamp,
    lastMessage?: string,
    lastMessageAt?: Timestamp,
    unreadCount?:number,
}
export type Message = {
    senderId:string,
    text:string,
    createdAt:Timestamp | Date,
    read:boolean,
}