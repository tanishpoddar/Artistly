'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Artist } from '@/lib/types';
import { categories } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedFilters } from '@/hooks/use-optimized-filters';
import { useGraphQL, queries } from '@/lib/graphql';
import { useAppContext } from '@/contexts/AppContext';

/**
 * ArtistCard component for displaying individual artist information
 * 
 * @param artist - Artist data to display
 * @returns JSX.Element - Artist card component
 */
const ArtistCard = ({ artist }: { artist: Artist }) => {
  // Validate imageUrl to ensure it's a valid, non-empty string
  const isValidImageUrl = artist.imageUrl && 
    typeof artist.imageUrl === 'string' && 
    artist.imageUrl.trim() !== '' && 
    artist.imageUrl !== 'null' && 
    artist.imageUrl !== 'undefined';

  // Check if this is a temporary artist (submitted during current session)
  const isTemporaryArtist = artist.id.startsWith('temp-');

  return (
    <Card className="w-full overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl flex flex-col relative">
      {/* New badge for temporary artists */}
      {isTemporaryArtist && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
            New
          </Badge>
        </div>
      )}
      <CardHeader className="p-0">
        {isValidImageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            width={400}
            height={400}
            className="h-60 w-full object-cover"
            data-ai-hint="artist portrait"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Fallback placeholder - shown when no image or image fails to load */}
        <div className={`h-60 w-full bg-muted flex items-center justify-center ${isValidImageUrl ? 'hidden' : ''}`}>
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">🎭</div>
            <div className="text-sm">No Image Available</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{artist.name}</CardTitle>
        <div className="flex flex-wrap gap-1 mb-2">
            {artist.categories.map(category => {
                const catLabel = categories.find(c => c.value === category)?.label || category;
                return <Badge key={category} variant="secondary" className="capitalize">{catLabel}</Badge>
            })}
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-1">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{artist.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
          {`$${artist.priceRange.min} - $${artist.priceRange.max}`}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Ask for Quote</Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Loading skeleton for artist cards
 * Provides visual feedback during data loading
 */
const ArtistCardSkeleton = () => (
    <Card className="w-full overflow-hidden shadow-md flex flex-col">
        <Skeleton className="h-60 w-full" />
        <CardContent className="p-4 flex-grow space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
            </div>
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);

/**
 * Artists listing page with advanced filtering and GraphQL integration
 * 
 * Features:
 * - Optimized filtering with React 18 performance features
 * - GraphQL data fetching
 * - Global state management
 * - Responsive design
 * 
 * @returns JSX.Element - Complete artists listing page
 */
function ArtistsPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  // Global context for state management
  const { state, dispatch } = useAppContext();
  
  // GraphQL integration
  const { query } = useGraphQL();
  
  // Optimized filters hook
  const {
    filteredArtists,
    isPending: isFiltering,
    filters,
    updateFilters,
    clearFilters,
    availableLocations,
    priceStats,
  } = useOptimizedFilters(state.artists);

  // Local loading state
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  
  /**
   * Fetch artists data using GraphQL
   * Falls back to REST API if GraphQL fails
   */
  useEffect(() => {
    // Only fetch data once on initial load
    if (hasLoadedInitialData) return;
    
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        // Try GraphQL first
        const graphqlResponse = await query({
          query: queries.getAllArtists,
        });
        
        if (graphqlResponse.errors) {
          throw new Error('GraphQL query failed');
        }
        
        const artists = graphqlResponse.data;
        // Preserve temporary artists when setting new data
        const temporaryArtists = state.artists.filter(artist => artist.id.startsWith('temp-'));
        dispatch({ type: 'SET_ARTISTS', payload: [...artists, ...temporaryArtists] });
      } catch (error) {
        console.warn('GraphQL failed, falling back to REST API:', error);
        
        // Fallback to REST API
        try {
          const res = await fetch('/api/artists');
          const data = await res.json();
          // Preserve temporary artists when setting new data
          const temporaryArtists = state.artists.filter(artist => artist.id.startsWith('temp-'));
          dispatch({ type: 'SET_ARTISTS', payload: [...data, ...temporaryArtists] });
        } catch (restError) {
          console.error("Failed to fetch artists", restError);
          dispatch({ type: 'ADD_NOTIFICATION', payload: {
            type: 'error',
            message: 'Failed to load artists. Please try again later.',
          }});
        }
      } finally {
        setIsLoading(false);
        setHasLoadedInitialData(true);
      }
    };
    
    fetchArtists();
  }, [query, dispatch, hasLoadedInitialData]);

  /**
   * Initialize filters from URL parameters
   */
  useEffect(() => {
    if (initialCategory !== 'all') {
      updateFilters({ category: initialCategory });
    }
  }, [initialCategory, updateFilters]);

  /**
   * Handle filter changes with optimized updates
   */
  const handleFilterChange = (name: string, value: any) => {
    updateFilters({ [name]: value });
  };
  
  /**
   * Memoized price label for display
   */
  const priceLabel = useMemo(() => {
    return `$${filters.price[0]} - $${filters.price[1]}${filters.price[1] === priceStats.max ? '+' : ''}`;
  }, [filters.price, priceStats.max]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline">Meet Our Artists</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Discover talented performers for your next event.
        </p>
        <div className="text-sm text-muted-foreground mt-2">
          Artists with <Badge variant="outline" className="text-xs">New</Badge> badges are recently submitted profiles visible during this session.
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. New York"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Price Range</Label>
                  <span className="text-sm font-medium text-muted-foreground">{priceLabel}</span>
                </div>
                <Slider
                  value={filters.price}
                  onValueChange={(value) => handleFilterChange('price', value)}
                  max={priceStats.max}
                  min={priceStats.min}
                  step={100}
                  className="mt-4"
                  disabled={isLoading}
                />
              </div>
              
              <Separator />
              
              {/* Clear Filters Button */}
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={clearFilters} 
                disabled={isLoading}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          {/* Loading State */}
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ArtistCardSkeleton key={i} />
                ))}
            </div>
          ) : filteredArtists.length > 0 ? (
            <>
              {/* Results Count and Filtering Indicator */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredArtists.length} of {state.artists.length} artists
                  </p>
                  {filteredArtists.some(artist => artist.id.startsWith('temp-')) && (
                    <p className="text-sm text-green-600 font-medium">
                      {filteredArtists.filter(artist => artist.id.startsWith('temp-')).length} new submission{filteredArtists.filter(artist => artist.id.startsWith('temp-')).length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {isFiltering && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Updating results...
                  </div>
                )}
              </div>
              
              {/* Artists Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </>
          ) : (
            /* No Results State */
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">No Artists Found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to find more results.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Loading fallback component for Suspense
 */
function ArtistsPageLoading() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ArtistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <Suspense fallback={<ArtistsPageLoading />}>
      <ArtistsPageContent />
    </Suspense>
  );
}
