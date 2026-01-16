/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogueRequest } from '../models/CatalogueRequest';
import type { CatalogueResponse } from '../models/CatalogueResponse';
import axiosInstance from 'config/axiosConfig';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GET_ECARDS_ENDPOINT } from 'constants/api';

export class CatalogueService {

    /**
     * Used to get a list of the available products
     * The list will include both texts and images. It will also include your currently available discount if "All" is set to "False")
     * @param xApiNonce A random value that you have not used earlier. (max 50 characters)<br /><small>(this prevents your message from being re-transmitted, and thereby also replay attacks)</small>
     * @param xApiHash The SHA512 hash of a concatenated string containing the following: ( API-SECRET + MD5(CONTENT) + NONCE ).<br /><small>(this is used to obscure your API-SECRET while still authenticating you, and it also prevents the payload from getting tampered with en-route)</small>
     * @param requestBody 
     * @returns CatalogueResponse Success
     * @throws ApiError
     */
    public static postV31Catalogue(
        xApiNonce?: any,
        xApiHash?: any,
        requestBody?: CatalogueRequest,
    ): CancelablePromise<CatalogueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v4/Catalogue',
            headers: {
                'X-API-NONCE': xApiNonce,
                'X-API-HASH': xApiHash,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    public static postV31CatalogueTest() {
        return fetch("/data/catalogue.json",{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          }
        )
    }
    public static postV31CatalogueSort() {
        return fetch("/data/catalogueSortList.json",{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          }
        )
    }
    public static postV31CatalogueDb() {
        return axiosInstance().get(`${GET_ECARDS_ENDPOINT}`);
    }

}
