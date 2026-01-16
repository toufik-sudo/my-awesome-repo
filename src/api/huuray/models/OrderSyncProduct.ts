/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing information about a product
 */
export type OrderSyncProduct = {
    /**
     * The token used to identify a specific product.
     */
    Token: string;
    /**
     * The value denomination that you want to order. Must be specified in minor units (i.e. $5.00 should be sent as 500)
     */
    Value: number;
    /**
     * The currency of the product.
     */
    Currency: string;
    /**
     * An optional time and date for the giftcards to expire. If omitted, the default expiration will be used, and the value cannot exceed the default expiration.
     */
    Expires?: string | null;
};
