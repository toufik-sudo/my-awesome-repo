/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderBuyer } from './OrderBuyer';
import type { OrderProduct } from './OrderProduct';
import type { OrderReceiver } from './OrderReceiver';

/**
 * An object containing all the necessary information for ordering giftcards
 */
export type OrderRequest = {
    Product: OrderProduct;
    Sync: boolean | null;
    /**
     * The method used to deliver the codes (SMS, Email, None)
     */
    DeliveryMethod?: string;

    DeliveryTemplateId?: number;
    /**
     * An optional ID that you can use to identify the resulting order with
     */
    RefID?: string | null;
    /**
     * An optional message to include in all the SMS/Emails (if applicable)
     */
    PersonalMessage?: string | null;
    /**
     * The ID of the Template to use for SMS/Email (if applicable). Can be omitted if the default templates are set in the B2B administration interface.
     */
    TemplateID?: number | null;
    /**
     * An optional future date for delivery to take place, if null delivery will happen as soon as possible
     */
    DeliveryDatetime?: string | null;
    // Buyer?: OrderBuyer;
    /**
     * A list of all the receivers. It is required unless DeliveryMethod is set to None. If specified, the count must be either 1 or match Product.Quantity
     */
    Recipients?: Array<OrderReceiver> | null;
};
