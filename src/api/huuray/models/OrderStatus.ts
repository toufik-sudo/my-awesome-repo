/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Object describing the outcome of an Order Cancel.
 */
export type OrderStatus = {
    /**
     * The ID of the given Order
     */
    OrderID?: number;
    /**
     * Reflects whether or not the order was Cancelled or not.
     */
    Cancelled?: boolean;
    /**
     * Message describing the action taken regarding the given order
     */
    Message?: string | null;
};
