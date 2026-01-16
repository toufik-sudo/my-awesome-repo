/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SearchDeliveryMethods } from './SearchDeliveryMethods';

/**
 * Object containing information about a receiver
 */
export type SearchReceiver = {
    /**
     * Name of the receiver (either person or company)
     */
    NameOrCompanyName?: string | null;
    /**
     * An optional "c/o" or "att:" for the receiver address
     */
    CareOfOrAttention?: string | null;
    /**
     * The e-mail address of the receiver (Required if sending via e-mail)
     */
    Email?: string | null;
    /**
     * The phone number of the receiver (Required if sending via SMS)
     */
    Number?: number | null;
    /**
     * The postal address of the receiver (Required if sending via Postal)
     */
    Address?: string | null;
    /**
     * The messenger id of the receiver (Required if sending via facebook)
     */
    MessengerID?: string | null;
    /**
     * The postal code (not necessarily ZIP) for the address of the receiver (Required if sending via Postal)
     */
    Zipcode?: string | null;
    /**
     * The city name for the address of the receiver (Required if sending via Postal)
     */
    City?: string | null;
    /**
     * A personal message to be included with the giftcard
     */
    Message?: string | null;
    /**
     * An optional future date for delivery to take place
     */
    DeliveryDatetime?: string | null;
    DeliveryMethod?: SearchDeliveryMethods;
};
