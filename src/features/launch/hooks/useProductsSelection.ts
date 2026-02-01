// -----------------------------------------------------------------------------
// useProductsSelection Hook
// Manages product and category selection for launch wizard
// Migrated from old_app hooks
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useLaunchWizard } from './useLaunchWizard';
import { useCategories } from '@/api/hooks/useLaunchApi';
import {
  PROGRAM_PRODUCTS,
  PROGRAM_CATEGORIES,
  FULL_PRODUCTS,
  FULL_CATEGORIES_PRODUCTS
} from '@/constants/wall/launch';

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  points?: number;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  productsCount?: number;
}

export const useProductsSelection = () => {
  const { updateStepData, launchData } = useLaunchWizard();
  
  const platformId = (launchData.platform as { id?: number })?.id || (launchData.platformId as number);
  
  // Fetch categories from API
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories({
    platform: platformId,
    size: 50,
    offset: 0
  });

  // State from store
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    (launchData[PROGRAM_PRODUCTS] as string[]) || []
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    (launchData[PROGRAM_CATEGORIES] as string[]) || []
  );
  const [products, setProducts] = useState<Product[]>(
    (launchData[FULL_PRODUCTS] as Product[]) || []
  );
  const [categories, setCategories] = useState<Category[]>(
    (launchData[FULL_CATEGORIES_PRODUCTS] as Category[]) || []
  );

  // Parse API categories
  const apiCategories: Category[] = (categoriesData?.entries || []).map((cat: any) => ({
    id: cat.id?.toString() || cat.categoryId?.toString(),
    name: cat.name || cat.categoryName,
    description: cat.description,
    productsCount: cat.productsCount || 0
  }));

  // Mock products (would come from API)
  const availableProducts: Product[] = [
    { id: '1', name: 'Gift Card $50', description: 'Amazon gift card', points: 500, category: 'Gift Cards' },
    { id: '2', name: 'Gift Card $100', description: 'Amazon gift card', points: 1000, category: 'Gift Cards' },
    { id: '3', name: 'Premium Headphones', description: 'Wireless noise-canceling', points: 2500, category: 'Electronics' },
    { id: '4', name: 'Smart Watch', description: 'Fitness tracker watch', points: 3000, category: 'Electronics' },
    { id: '5', name: 'Extra PTO Day', description: 'One additional paid day off', points: 5000, category: 'Benefits' },
  ];

  // Sync to store
  useEffect(() => {
    updateStepData(PROGRAM_PRODUCTS, selectedProductIds);
    updateStepData(PROGRAM_CATEGORIES, selectedCategoryIds);
    updateStepData(FULL_PRODUCTS, products);
    updateStepData(FULL_CATEGORIES_PRODUCTS, categories);
  }, [selectedProductIds, selectedCategoryIds, products, categories]);

  const toggleProduct = useCallback((product: Product) => {
    const exists = selectedProductIds.includes(product.id);
    
    if (exists) {
      setSelectedProductIds(prev => prev.filter(id => id !== product.id));
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProductIds(prev => [...prev, product.id]);
      setProducts(prev => [...prev, product]);
    }
  }, [selectedProductIds]);

  const toggleCategory = useCallback((category: Category) => {
    const exists = selectedCategoryIds.includes(category.id);
    
    if (exists) {
      setSelectedCategoryIds(prev => prev.filter(id => id !== category.id));
      setCategories(prev => prev.filter(c => c.id !== category.id));
    } else {
      setSelectedCategoryIds(prev => [...prev, category.id]);
      setCategories(prev => [...prev, category]);
    }
  }, [selectedCategoryIds]);

  const addNewProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `new-${Date.now()}`
    };
    setSelectedProductIds(prev => [...prev, newProduct.id]);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const addNewCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `new-${Date.now()}`
    };
    setSelectedCategoryIds(prev => [...prev, newCategory.id]);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const selectAllProducts = useCallback(() => {
    const allIds = availableProducts.map(p => p.id);
    setSelectedProductIds(allIds);
    setProducts(availableProducts);
  }, []);

  const deselectAllProducts = useCallback(() => {
    setSelectedProductIds([]);
    setProducts([]);
  }, []);

  const selectAllCategories = useCallback(() => {
    const allIds = apiCategories.map(c => c.id);
    setSelectedCategoryIds(allIds);
    setCategories(apiCategories);
  }, [apiCategories]);

  const deselectAllCategories = useCallback(() => {
    setSelectedCategoryIds([]);
    setCategories([]);
  }, []);

  // Validation
  const isValid = selectedProductIds.length > 0 || selectedCategoryIds.length > 0;

  return {
    // Products
    availableProducts,
    selectedProductIds,
    selectedProducts: products,
    toggleProduct,
    addNewProduct,
    selectAllProducts,
    deselectAllProducts,
    
    // Categories
    apiCategories,
    selectedCategoryIds,
    selectedCategories: categories,
    toggleCategory,
    addNewCategory,
    selectAllCategories,
    deselectAllCategories,
    
    // Loading states
    categoriesLoading,
    categoriesError,
    
    // Validation
    isValid
  };
};

export default useProductsSelection;
