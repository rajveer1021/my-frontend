import { useState, useEffect, useCallback } from 'react';
import { enquiryService } from '../services/EnquiryService';

export const useInquiries = (initialFilters = {}) => {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    ...initialFilters
  });

  // Fetch inquiries
  const fetchInquiries = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const mergedFilters = { ...filters, ...customFilters };
      const response = await enquiryService.getInquiries(mergedFilters);

      setInquiries(response.inquiries);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to page 1 if filters change
    }));
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.pages) {
      goToPage(pagination.page + 1);
    }
  }, [pagination.page, pagination.pages, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  }, [pagination.page, goToPage]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update inquiry status
  const updateInquiryStatus = useCallback(async (inquiryId, status) => {
    try {
      await enquiryService.updateInquiryStatus(inquiryId, status);
      
      // Update local state
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === inquiryId 
            ? { ...inquiry, status }
            : inquiry
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Update inquiry status error:', err);
      return false;
    }
  }, []);

  // Respond to inquiry
  const respondToInquiry = useCallback(async (inquiryId, response) => {
    try {
      await enquiryService.respondToInquiry(inquiryId, response);
      
      // Update local state
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === inquiryId 
            ? { 
                ...inquiry, 
                status: 'responded',
                response: response,
                respondedAt: new Date().toISOString()
              }
            : inquiry
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Respond to inquiry error:', err);
      return false;
    }
  }, []);

  return {
    // Data
    inquiries,
    pagination,
    filters,
    
    // States
    loading,
    error,
    
    // Actions
    fetchInquiries,
    updateFilters,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    updateInquiryStatus,
    respondToInquiry,
    
    // Computed
    hasNextPage: pagination.page < pagination.pages,
    hasPrevPage: pagination.page > 1,
    isEmpty: inquiries.length === 0 && !loading,
    totalCount: pagination.total
  };
};

// Hook for inquiry statistics
export const useInquiryStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    new: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const statsData = await enquiryService.getInquiryStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Fetch inquiry stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
};