/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelRequest } from '../models/CancelRequest';
import type { CancelResponse } from '../models/CancelResponse';
import type { Response } from '../models/Response';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CancelService {

    /**
     * Used to Cancel Orders or Giftcards.
     * n/a
     * @param xApiNonce A random value that you have not used earlier. (max 50 characters)<br /><small>(this prevents your message from being re-transmitted, and thereby also replay attacks)</small>
     * @param xApiHash The SHA512 hash of a concatenated string containing the following: ( API-SECRET + MD5(CONTENT) + NONCE ).<br /><small>(this is used to obscure your API-SECRET while still authenticating you, and it also prevents the payload from getting tampered with en-route)</small>
     * @param requestBody 
     * @returns CancelResponse Success
     * @returns Response Success
     * @throws ApiError
     */
    public static deleteV31Cancel(
        xApiNonce?: any,
        xApiHash?: any,
        requestBody?: CancelRequest,
    ): CancelablePromise<CancelResponse | Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v4/Cancel',
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
