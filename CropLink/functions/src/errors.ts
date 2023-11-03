interface ERROR_CODES {
    [code:string]: string;
}
export const ERROR_CODES:ERROR_CODES = {
    "permission-denied": "You do not have permission to perform this action.",
    "invalid-argument": "Invalid argument provided.",
    "unauthenticated": "You must be logged in to perform this action.",
    "already-exists": "This document already exists.",
    "ad-already-live": "This ad is already live.",
    "ad-not-found": "This ad was not found.",
    "bid-not-found": "This bid was not found.",
    "bid-already-cancelled": "This bid has already been cancelled.",
    "bid-already-accepted": "This bid has already been accepted.",
    "bid-already-rejected": "This bid has already been rejected.",
};
