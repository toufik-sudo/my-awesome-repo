/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderRequest } from '../models/OrderRequest';
import type { OrderResponse } from '../models/OrderResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrderService {

    /**
     * Used to order giftcards.
     * The giftcards will be sent out as redeemable links. They will be sent out automatically via Email or SMS, or returned in a callback if you have set one up and enabled this feature.
     * @param xApiNonce A random value that you have not used earlier. (max 50 characters)<br /><small>(this prevents your message from being re-transmitted, and thereby also replay attacks)</small>
     * @param xApiHash The SHA512 hash of a concatenated string containing the following: ( API-SECRET + MD5(CONTENT) + NONCE ).<br /><small>(this is used to obscure your API-SECRET while still authenticating you, and it also prevents the payload from getting tampered with en-route)</small>
     * @param requestBody 
     * @returns OrderResponse Success
     * @throws ApiError
     */
    public static postV31Order(
        xApiNonce?: any,
        xApiHash?: any,
        requestBody?: OrderRequest,
    ): CancelablePromise<OrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v4/Order',
            headers: {
                'X-API-NONCE': xApiNonce,
                'X-API-HASH': xApiHash,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }

}
