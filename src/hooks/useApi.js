import { useState, useEffect } from 'react';

export const useApi = (apiFunction, params = null, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (executeParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(executeParams);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute(params)
  };
};

export const useProducts = (params = {}) => {
  return useApi(
    async (searchParams) => {
      const { productsAPI } = await import('../api/products');
      return productsAPI.getProducts(searchParams);
    },
    params,
    true
  );
};

export const useProduct = (id) => {
  return useApi(
    async (productId) => {
      const { productsAPI } = await import('../api/products');
      return productsAPI.getProduct(productId);
    },
    id,
    !!id
  );
};

export const useCategories = () => {
  return useApi(
    async () => {
      const { productsAPI } = await import('../api/products');
      return productsAPI.getCategories();
    },
    null,
    true
  );
};