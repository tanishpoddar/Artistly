'use client';

import { useState, useTransition, useDeferredValue, useMemo, useCallback } from 'react';
import { Artist } from '@/lib/types';

/**
 * Filter configuration interface
 */
interface FilterConfig {
  category: string;
  location: string;
  price: [number, number];
}

/**
 * Custom hook for optimized filtering with React 18 performance features
 * 
 * Features:
 * - useTransition for non-blocking filter updates
 * - useDeferredValue for smooth UI updates
 * - Memoized filter logic for performance
 * 
 * @param artists - Array of artists to filter
 * @returns Object with filtered artists, loading state, and filter controls
 */
export function useOptimizedFilters(artists: Artist[]) {
  // State for filters
  const [filters, setFilters] = useState<FilterConfig>({
    category: 'all',
    location: '',
    price: [0, 5000],
  });

  // useTransition for non-blocking filter updates
  const [isPending, startTransition] = useTransition();

  // useDeferredValue for smooth UI updates during filtering
  const deferredFilters = useDeferredValue(filters);

  /**
   * Memoized filter logic for performance optimization
   * Only recalculates when artists or filters change
   */
  const filteredArtists = useMemo(() => {
    // Use deferred filters for smooth UI updates
    const { category, location, price } = deferredFilters;
    
    return artists.filter((artist) => {
      // Category filter
      if (category !== 'all' && !artist.categories.includes(category)) {
        return false;
      }
      
      // Location filter (case-insensitive partial match)
      if (location && !artist.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Price range filter
      if (artist.priceRange.min > price[1] || artist.priceRange.max < price[0]) {
        return false;
      }
      
      return true;
    });
  }, [artists, deferredFilters]);

  /**
   * Update filters with transition for non-blocking UI
   * @param newFilters - Partial filter configuration
   */
  const updateFilters = useCallback((newFilters: Partial<FilterConfig>) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    });
  }, []);

  /**
   * Reset all filters to default values
   */
  const clearFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        category: 'all',
        location: '',
        price: [0, 5000],
      });
    });
  }, []);

  /**
   * Get unique locations from artists for filter options
   */
  const availableLocations = useMemo(() => {
    const locations = new Set(artists.map(artist => artist.location));
    return Array.from(locations).sort();
  }, [artists]);

  /**
   * Get price range statistics for filter bounds
   */
  const priceStats = useMemo(() => {
    if (artists.length === 0) return { min: 0, max: 5000 };
    
    const prices = artists.flatMap(artist => [
      artist.priceRange.min,
      artist.priceRange.max
    ]);
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [artists]);

  return {
    // Filtered data
    filteredArtists,
    
    // Loading state
    isPending,
    
    // Current filters
    filters,
    
    // Filter controls
    updateFilters,
    clearFilters,
    
    // Helper data
    availableLocations,
    priceStats,
    
    // Deferred filters for UI updates
    deferredFilters,
  };
}

/**
 * Hook for debounced search input
 * Useful for location search to avoid excessive filtering
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const updateSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  }, []);

  return {
    searchTerm: deferredSearchTerm,
    updateSearch,
    isPending,
  };
} 