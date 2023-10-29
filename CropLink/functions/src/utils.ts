import { CallableRequest } from "firebase-functions/v2/https";
export const isAdmin = (request: CallableRequest) => {
    return request.auth?.token.admin === true;
};
