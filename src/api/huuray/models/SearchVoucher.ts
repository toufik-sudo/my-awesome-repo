/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing information about a voucher
 */
export type SearchVoucher = {
    /**
     * The unique identifier of the voucher (required to show code in output)
     */
    ID?: number | null;
    /**
     * The redeemable code of the voucher
     */
    Code?: string | null;
    /**
     * The URL to redeem the voucher
     */
    RedeemLink?: string | null;
    /**
     * The time and date for when the voucher was added
     */
    Created?: string;
    /**
     * The time and date for when the voucher was used
     */
    Used?: string | null;
    /**
     * The time and date for when the voucher expires
     */
    Expires?: string;
    /**
     * A value used to verify the authenticity of the voucher (if applicable)
     */
    CVV?: string | null;
};
