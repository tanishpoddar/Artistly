'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * LazyPage component that wraps content with Suspense for lazy loading
 * Provides a default skeleton loading state or custom fallback
 */
export function LazyPage({ children, fallback }: LazyPageProps) {
  const defaultFallback = (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <React.Suspense fallback={fallback || defaultFallback}>
      {children}
    </React.Suspense>
  );
}

/**
 * LazyComponent wrapper for individual components that need lazy loading
 */
export function LazyComponent({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const defaultFallback = <Skeleton className="h-32 w-full" />;
  
  return (
    <React.Suspense fallback={fallback || defaultFallback}>
      {children}
    </React.Suspense>
  );
} 