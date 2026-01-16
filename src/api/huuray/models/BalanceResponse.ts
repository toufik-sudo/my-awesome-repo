/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BalanceItem } from './BalanceItem';

/**
 * The response containing available balances with currency
 */
export type BalanceResponse = {
    /**
     * The list of Balances
     */
    Balances?: Array<BalanceItem> | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
