/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderSyncProduct } from './OrderSyncProduct';

/**
 * An object containing all the necessary information for ordering giftcards
 */
export type OrderSyncRequest = {
    Product: OrderSyncProduct;
    /**
     * An optional ID that you can use to identify the resulting order with
     */
    RefID?: string | null;
};
