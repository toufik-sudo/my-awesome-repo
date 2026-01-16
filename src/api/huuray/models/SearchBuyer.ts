/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Object containing information about the buyer
 */
export type SearchBuyer = {
    /**
     * The name of the buyer
     */
    Name?: string | null;
    /**
     * The company name
     */
    CompanyName?: string | null;
    /**
     * The e-mail address of the buyer
     */
    Email?: string | null;
    /**
     * The phone number of the buyer
     */
    Number?: number | null;
    /**
     * An optional internal reference to an order in your own system
     */
    RefID?: string | null;
    /**
     * The ID from the successful money transaction
     */
    TransactionID?: string | null;
    /**
     * The IP address of the request
     */
    IP?: string | null;
};
