/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BalanceResponse } from '../models/BalanceResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BalanceService {

    /**
     * Used to get available balances
     * The amount of available balances on the B2B account in minor units with currency
     * @param xApiNonce A random value that you have not used earlier. (max 50 characters)<br /><small>(this prevents your message from being re-transmitted, and thereby also replay attacks)</small>
     * @param xApiHash The SHA512 hash of a concatenated string containing the following: ( API-SECRET + MD5(CONTENT) + NONCE ).<br /><small>(this is used to obscure your API-SECRET while still authenticating you, and it also prevents the payload from getting tampered with en-route)</small>
     * @returns BalanceResponse Success
     * @throws ApiError
     */
    public static getV31Balance(
        xApiNonce?: any,
        xApiHash?: any,
    ): CancelablePromise<BalanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v4/Balance',
            headers: {
                'X-API-NONCE': xApiNonce,
                'X-API-HASH': xApiHash,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }

}
