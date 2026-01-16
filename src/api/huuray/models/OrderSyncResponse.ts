/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderSyncResponse_Voucher } from './OrderSyncResponse_Voucher';

/**
 * An object containing the order information returned by the callback
 */
export type OrderSyncResponse = {
    /**
     * A unique ID which will be connected to the resulting order. You can use this to identify the incoming callback.
     */
    OrderUID?: string | null;
    /**
     * The unique identifier of the order (used by resend and cancel endpoints)
     */
    ID?: number | null;
    /**
     * A value used to verify the authenticity of the order (if applicable)
     */
    UID?: string | null;
    /**
     * The optional ID that you specified in the order request.
     */
    RefID?: string | null;
    /**
     * The resulting vouchers for the placed order.
     */
    Vouchers?: Array<OrderSyncResponse_Voucher> | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
