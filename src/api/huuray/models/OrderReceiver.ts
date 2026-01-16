/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a single recipient
 */
export type OrderReceiver = {
    /**
     * The name of the recipient
     */
    Name?: string | null;
    /**
     * The email address of the recipient (required if DeliveryMethod is set to Email)
     */
    Email?: string | null;
    /**
     * The phone number of the recipient (required if DeliveryMethod is set to SMS)
     */
    Phone?: string | null;
    /**
     * An optional ID that you can use to identify the individual recipient with later.
     */
    RefID?: string | null;
};
