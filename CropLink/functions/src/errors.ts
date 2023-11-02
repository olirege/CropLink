interface ERROR_CODES {
    [code:string]: string;
}
export const ERROR_CODES:ERROR_CODES = {
    "permission-denied": "You do not have permission to perform this action.",
    "invalid-argument": "Invalid argument provided.",
    "unauthenticated": "You must be logged in to perform this action.",
    "already-exists": "This document already exists.",
    "ad-already-live": "This ad is already live.",
};
