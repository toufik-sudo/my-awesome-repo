/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Object describing the outcome of an Voucher Cancel.
 */
export type VoucherStatus = {
    /**
     * The ID of the a specific Voucher in the given Order.
     */
    VoucherID?: number;
    /**
     * Reflects whether or not a specific Voucher was Cancelled or not.
     */
    Cancelled?: boolean;
    /**
     * Message describing the action taken regarding a specific Voucher
     */
    Message?: string | null;
};
