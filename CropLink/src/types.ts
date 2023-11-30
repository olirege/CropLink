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
    pricePerTon: number;
    tons: number;
    expectedHarvestDate: Date;
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
    requestDate: Date;
    minCostPerTon: number;
    maxCostPerTon: number;
    tons: number;
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
    hasEscrow: boolean;
    accountType: string;
    escrowAuth?: {
        email: string;
        apiKey: string;
    };
    profilePic: string;
    bannerPic: string;
};
export type Clause = {
    id: string;
    text: string;
    draft: boolean;
    state: "pending" | "accepted" | "rejected";
    createdAt: Timestamp,
    authorId: string,
    updatedAt: Timestamp,
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
    ready?:string[],
    type: "sell" | "gig",
    context: Gig,
};
export type ChatRoom = {
    id: string,
    adId: string,
    sellerId: string,
    buyerId: string,
    createdAt: Timestamp,
    lastSender?: string,
    lastMessage?: string,
    lastUpdated?: Timestamp,
    unreadCount?:number,
}
export type Message = {
    senderId:string,
    text:string,
    createdAt:Timestamp | Date,
    read:boolean,
    quote?:{
        text:string,
    },
}
export type Produce = {
    id: string;
    sub: string[];
};
export type Job = {
    createdAt: Timestamp;
    jobId: string;
    title: string;
    live: boolean;
    description: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    tasks: string[];
    type: string;
};
export type Gig = {
    createdAt: Timestamp;
    gigId: string;
    title: string;
    live: boolean;
    description: string;
    location: string;
    milestones: {name:string,description:string,price:number}[];
};
export type Application = {
    createdAt: Timestamp;
    parentId?: string;
    applicationId: string;
    status: string;
    updatedAt: Timestamp;
    resume?: string;
    applicantId?: string;
    ownerId?: string;
    parentType?: string;
    name?: string;
    email?: string;
    phone?: string;
};
export type Transaction = {
    [key: string]: any;
}