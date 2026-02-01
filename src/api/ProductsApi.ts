// -----------------------------------------------------------------------------
// Products API
// Migrated from old_app/src/api/ProductsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { PRODUCTS } from '@/constants/api';

export interface IProductParams {
  platform?: number;
  program?: number;
  search?: string;
  category?: number;
  [key: string]: unknown;
}

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  [key: string]: unknown;
}

export interface IProductsResponse {
  products: IProduct[];
  total?: number;
}

class ProductsApi {
  async getProducts(params?: IProductParams): Promise<IProductsResponse> {
    const { data } = await axiosInstance().get(PRODUCTS, { params });
    return data;
  }
}

export const productsApi = new ProductsApi();
export default ProductsApi;
