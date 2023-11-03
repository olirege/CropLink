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
};
export type Profile = {
    name: string;
    accountType: string;
};