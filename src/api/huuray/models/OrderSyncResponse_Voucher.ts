/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing the voucher information returned by the callback
 */
export type OrderSyncResponse_Voucher = {
    /**
     * The unique identifier of the voucher (used by resend and cancel endpoints)
     */
    ID?: number | null;
    /**
     * The redeemable code of the voucher. (This will be blanked unless IncludeCodes is enabled in your Callback)
     */
    Code?: string | null;
    /**
     * A value used to verify the authenticity of the voucher (if applicable)
     */
    CVV?: string | null;
    /**
     * The URL to redeem the voucher
     */
    RedeemLink?: string | null;
    /**
     * The time and date for when the voucher expires
     */
    Expires?: string;
};
