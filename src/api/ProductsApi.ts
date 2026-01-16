import axiosInstance from 'config/axiosConfig';
import { PRODUCTS } from 'constants/api';

class ProductsApi {
  getProducts = async params => {
    const { data } = await axiosInstance().get(PRODUCTS, { params });

    return data;
  };
}

export default ProductsApi;
