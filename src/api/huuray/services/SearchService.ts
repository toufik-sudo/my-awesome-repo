/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchRequest } from '../models/SearchRequest';
import type { SearchResponse } from '../models/SearchResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SearchService {

    /**
     * Used to search through giftcards from previous orders.
     * n/a
     * @param xApiNonce A random value that you have not used earlier. (max 50 characters)<br /><small>(this prevents your message from being re-transmitted, and thereby also replay attacks)</small>
     * @param xApiHash The SHA512 hash of a concatenated string containing the following: ( API-SECRET + MD5(CONTENT) + NONCE ).<br /><small>(this is used to obscure your API-SECRET while still authenticating you, and it also prevents the payload from getting tampered with en-route)</small>
     * @param requestBody 
     * @returns SearchResponse Success
     * @throws ApiError
     */
    public static postV31Search(
        xApiNonce?: any,
        xApiHash?: any,
        requestBody?: SearchRequest,
    ): CancelablePromise<SearchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v4/Search',
            headers: {
                'X-API-NONCE': xApiNonce,
                'X-API-HASH': xApiHash,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

}
