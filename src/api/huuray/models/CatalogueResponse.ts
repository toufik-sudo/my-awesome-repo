/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductFromCatalogue } from './ProductFromCatalogue';

/**
 * The response containing products
 */
export type CatalogueResponse = {
    /**
     * The list of products
     */
    Products?: Array<ProductFromCatalogue> | null;
    /**
     * HttpStatus code for response
     */
    Status?: number;
    /**
     * Error message describing an error that occured during the processing of the request
     */
    Message?: string | null;
};
