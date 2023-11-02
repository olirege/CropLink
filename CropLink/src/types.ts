export type User = {
    [key: string]: any;
  };
  
export type SellerAd = {
    id?: string;
    type: string;
    variety: string;
    yieldTonnage: number;
    expectedHarvestDate: Date;
    price: number;
    images: string[];
    live: boolean;
    postedOn?: string;
    createdAt: Date;
    adType: string;
};
export type BuyerAd = {
    id?: string;
    type: string;
    yieldTonnage: number;
    requestDate: Date;
    price: number;
    live: boolean;
    postedOn?: string;
    createdAt: Date;
    adType: string;
};
export type Profile = {
    name: string;
    accountType: string;
};