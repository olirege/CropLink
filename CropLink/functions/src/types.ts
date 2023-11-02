export type Ad = {
    id?: string;
    type: string;
    yieldTonnage: number;
    price: number;
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
};
export type SellerAd = {
    id?: string;
    type: string;
    variety: string;
    yieldTonnage: number;
    expectedHarvestDate: string;
    price: number;
    images: string[];
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
};
export type BuyerAd = {
    id?: string;
    type: string;
    yieldTonnage: number;
    requestDate: string;
    price: number;
    live: boolean;
    createdAt: Date;
    postedBy?: string;
    postedOn?: string;
};
