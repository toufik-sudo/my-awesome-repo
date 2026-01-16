/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An object containing all the necessary information for resending a giftcard
 */
export type ResendRequest = {
    /**
     * The OrderID for the giftcards that you want to Resend.
     */
    OrderID: number;
    /**
     * The ID of the specific Voucher that you want to resend.
     */
    VoucherID: number;
    /**
     * An optional email address or phone number in case you need to change the recipient, leave as null to resend to the original recipient.
     */
    Receiver?: string | null;
};
