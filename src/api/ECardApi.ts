// -----------------------------------------------------------------------------
// ECard API Service
// Migrated from old_app/src/api/huuray/services/CatalogueService.ts
// Gift card catalogue management
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { GET_ECARDS_ENDPOINT } from '@/constants/api';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IECardProduct {
  ecardId: number;
  productToken?: string;
  brandName: string;
  country?: string;
  countryCode: string;
  discount?: number;
  denominations: string;
  currency: string;
  realTimeStock?: string;
  categories?: string;
  languageCode?: string;
  brandDescription?: string;
  redemptionInstructions?: string;
  logoFile?: string;
  isActive?: boolean;
}

export interface ICatalogueResponse {
  status: number;
  message: string;
  products: IECardProduct[];
}

export interface ICatalogueSortList {
  DEFAULT: string[];
  [countryCode: string]: string[];
}

export interface IECardCategory {
  value: string;
  label: string;
}

// Default eCard categories
export const ECARD_CATEGORIES: IECardCategory[] = [
  { value: 'Home', label: 'eCard.filter.category.Home' },
  { value: 'Travel', label: 'eCard.filter.category.Travel' },
  { value: 'Experiences', label: 'eCard.filter.category.Experiences' },
  { value: 'Fashion', label: 'eCard.filter.category.Fashion' },
  { value: 'Entertainment', label: 'eCard.filter.category.Entertainment' },
  { value: 'Others', label: 'eCard.filter.category.Others' },
  { value: 'Department', label: 'eCard.filter.category.Department' },
  { value: 'Supermarkets', label: 'eCard.filter.category.Supermarkets' },
  { value: 'Restaurants', label: 'eCard.filter.category.Restaurants' },
  { value: 'Beauty', label: 'eCard.filter.category.Beauty' },
  { value: 'Electronics', label: 'eCard.filter.category.Electronics' },
  { value: 'Sports', label: 'eCard.filter.category.Sports' },
  { value: 'Kids', label: 'eCard.filter.category.Kids' },
];

// -----------------------------------------------------------------------------
// API Service Class
// -----------------------------------------------------------------------------

class ECardApi {
  /**
   * Fetch all available eCards from the database
   */
  async getECards(): Promise<ICatalogueResponse> {
    try {
      const response = await axiosInstance().get(GET_ECARDS_ENDPOINT);
      const data = response.data;
      
      // Handle different response formats
      let products: IECardProduct[] = [];
      if (data.Products) {
        products = typeof data.Products === 'string' 
          ? JSON.parse(data.Products) 
          : data.Products;
      } else if (Array.isArray(data)) {
        products = data;
      } else if (data.data) {
        products = data.data;
      }

      // Normalize product data
      products = products.map((p: any) => ({
        ecardId: p.ecardId || p.EcardId || p.id,
        productToken: p.ProductToken || p.productToken,
        brandName: p.BrandName || p.brandName,
        country: p.Country || p.country,
        countryCode: p.CountryCode || p.countryCode || '',
        discount: p.Discount || p.discount,
        denominations: p.Denominations || p.denominations || '',
        currency: p.Currency || p.currency || 'EUR',
        realTimeStock: p.RealTimeStock || p.realTimeStock,
        categories: p.Categories || p.categories || '',
        languageCode: p.LanguageCode || p.languageCode,
        brandDescription: p.BrandDescription || p.brandDescription,
        redemptionInstructions: p.RedemptionInstructions || p.redemptionInstructions,
        logoFile: p.LogoFile || p.logoFile,
        isActive: p.isActive || false,
      }));

      return {
        status: data.Status || 200,
        message: data.Message || 'Catalogue loaded successfully',
        products,
      };
    } catch (error) {
      console.error('Error fetching eCards:', error);
      throw error;
    }
  }

  /**
   * Fetch sort order for eCards
   */
  async getCatalogueSortList(): Promise<ICatalogueSortList> {
    try {
      const response = await fetch('/data/catalogueSortList.json', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching sort list:', error);
      return { DEFAULT: [] };
    }
  }

  /**
   * Sort products based on sort list and country
   */
  sortProducts(
    products: IECardProduct[], 
    sortList: ICatalogueSortList, 
    preferredCountry: string = 'FR'
  ): IECardProduct[] {
    if (!sortList?.DEFAULT?.length) return products;

    const defaultSort = sortList.DEFAULT;
    return [...products].sort((a, b) => {
      const aIndex = defaultSort.indexOf(a.brandName);
      const bIndex = defaultSort.indexOf(b.brandName);

      // Prioritize preferred country items
      if (a.countryCode === preferredCountry && b.countryCode !== preferredCountry) return -1;
      if (b.countryCode === preferredCountry && a.countryCode !== preferredCountry) return 1;

      // Sort by index in sort list
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  /**
   * Filter products by search term, country, and category
   */
  filterProducts(
    products: IECardProduct[],
    filters: {
      searchTerm?: string;
      countryCode?: string;
      categories?: string[];
    }
  ): IECardProduct[] {
    return products.filter((product) => {
      // Search filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!product.brandName?.toLowerCase().includes(term)) {
          return false;
        }
      }

      // Country filter
      if (filters.countryCode && filters.countryCode !== 'all') {
        if (product.countryCode !== filters.countryCode) {
          return false;
        }
      }

      // Category filter
      if (filters.categories?.length) {
        const productCategories = product.categories?.split(',').map(c => c.trim()) || [];
        const hasMatchingCategory = filters.categories.some(cat => 
          productCategories.includes(cat)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get unique countries from product list
   */
  getAvailableCountries(products: IECardProduct[]): string[] {
    const countries = new Set<string>();
    products.forEach((product) => {
      if (product.countryCode) {
        countries.add(product.countryCode);
      }
    });
    return Array.from(countries).sort();
  }

  /**
   * Filter denominations to max value
   */
  filterDenominations(denominations: string, maxValue: number = 250): string {
    if (!denominations) return '';
    const values = denominations.split(',').map(v => parseInt(v.trim(), 10));
    const filtered = values.filter(v => !isNaN(v) && v <= maxValue);
    return filtered.join(', ');
  }
}

export const eCardApi = new ECardApi();
export default eCardApi;
