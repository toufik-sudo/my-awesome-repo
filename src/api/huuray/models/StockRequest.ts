/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing the required input for the stock API
 */
export type StockRequest = {
    /**
     * The unique token for the product you want to get stock information for
     */
    ProductToken: string;
    /**
     * The value to check availability for. Defaults to the default price for the product if value is null.
     */
    Value?: number | null;
    /**
     * The currency to check availability for. Defaults to the default currency for the product if value is null.
     */
    Currency?: string | null;
};
