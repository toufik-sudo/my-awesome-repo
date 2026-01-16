/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The response from a search
 */
export type OrderResponse = {
    /**
     * A unique ID which will be connected to the resulting order. You can use this to identify the incoming callback.
     */
    OrderUID?: string | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
