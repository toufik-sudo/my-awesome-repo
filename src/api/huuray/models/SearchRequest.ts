/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SearchBuyer } from './SearchBuyer';
import type { SearchProduct } from './SearchProduct';
import type { SearchReceiver } from './SearchReceiver';
import type { SearchVoucher } from './SearchVoucher';

/**
 * An object containing all the informations you can search for
 */
export type SearchRequest = {
    Buyer?: SearchBuyer;
    Receiver?: SearchReceiver;
    Product?: SearchProduct;
    Voucher?: SearchVoucher;
    /**
     * The earliest time and date to include in search
     */
    From?: string | null;
    /**
     * The latest time and date to include in search
     */
    To?: string | null;
    /**
     * The amount of results to include per page (only accepts 1 to 100, default is 25)
     */
    ResultsPerPage?: number | null;
    /**
     * The page index of results that you want to return (1-indexed)
     */
    PageNumber?: number | null;
};
