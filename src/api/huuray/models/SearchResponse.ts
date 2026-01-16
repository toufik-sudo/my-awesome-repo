/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SearchVoucher } from './SearchVoucher';

/**
 * The response from a search
 */
export type SearchResponse = {
    /**
     * The full count of matches
     */
    Count?: number;
    /**
     * The list of the matching vouchers
     */
    Vouchers?: Array<SearchVoucher> | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
