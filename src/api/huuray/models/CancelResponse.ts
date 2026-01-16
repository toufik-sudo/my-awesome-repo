/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderStatus } from './OrderStatus';
import type { VoucherStatus } from './VoucherStatus';

/**
 * The response from a Cancel request
 */
export type CancelResponse = {
    OrderStatus?: OrderStatus;
    /**
     * A list statuses for the individual Vouchers in the order, after the Cancel attempt.
     */
    VoucherStatus?: Array<VoucherStatus> | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
