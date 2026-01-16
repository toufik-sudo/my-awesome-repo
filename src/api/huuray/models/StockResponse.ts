/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The response containing stock information for a product
 */
export type StockResponse = {
    /**
     * Indicates if it is currently possible to order the product or not.
     */
    Active?: boolean;
    /**
     * The full count of giftcards found
     */
    Stock?: number | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
