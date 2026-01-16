/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents the company or individual purchasing the order
 */
export type OrderBuyer = {
    /**
     * The name of the buyer
     */
    Name?: string | null;
    /**
     * The address of the buyer
     */
    Address?: string | null;
    /**
     * The postal code of the buyers address
     */
    Postal?: string | null;
    /**
     * The city of the buyers address
     */
    City?: string | null;
    /**
     * The email address of the buyer
     */
    Email: string;
    /**
     * The phone number of the buyer
     */
    Phone?: string | null;
    /**
     * The company name of the buyer
     */
    CompanyName?: string | null;
    /**
     * The company VAT identifier of the buyer (CVR, SE, VAT)
     */
    VatID?: string | null;
};
