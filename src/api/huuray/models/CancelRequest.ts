/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing all the necessary information for Canceling giftcards
 */
export type CancelRequest = {
    /**
     * The ID of the Order you want to Cancel from
     */
    OrderID: number;
    /**
     * The ID of the specific Voucher in the given Order that you want to Cancel. If null is given, we will attempt to Cancel the entire Order.
     */
    VoucherID?: number | null;
};
