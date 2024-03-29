interface ERROR_CODES {
    [code:string]: string;
}
export const ERROR_CODES:ERROR_CODES = {
    "permission-denied": "You do not have permission to perform this action.",
    "invalid-argument": "Invalid argument provided.",
    "unauthenticated": "You must be logged in to perform this action.",
    "already-exists": "This document already exists.",
    "ad-does-not-exist": "This ad does not exist.",
    "ad-already-live": "This ad is already live.",
    "ad-not-live": "This ad was not live.",
    "ad-not-seller": "This action isn't allowed for this ad.",
    "bid-not-found": "This bid was not found.",
    "bid-already-cancelled": "This bid has already been cancelled.",
    "bid-already-accepted": "This bid has already been accepted.",
    "bid-already-rejected": "This bid has already been rejected.",
    "internal": "An internal error occurred. Please try again later.",
    "ad-already-not-live": "This ad is already not live.",
    "contract-does-not-exist": "This contract does not exist.",
    "parties-not-ready": "All parties must agree to the contract before it can be accepted.",
    "user-does-not-exist": "This user does not exist.",
    "user-does-not-have-escrow-account": "This user does not have an escrow account.",
    "transaction-no-landing-page": "This transaction does not have a landing page.",
    "transaction-does-not-exist": "This transaction does not exist.",
};
