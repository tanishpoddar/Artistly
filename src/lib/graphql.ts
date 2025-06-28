import { Artist } from './types';
import { artists } from './data';

// GraphQL query types
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data: T;
  errors?: Array<{ message: string }>;
}

// GraphQL schema simulation
const schema = {
  Artist: {
    id: 'String!',
    name: 'String!',
    categories: '[String!]!',
    location: 'String!',
    priceRange: 'PriceRange!',
    bio: 'String!',
    imageUrl: 'String!',
    languages: '[String!]!',
  },
  PriceRange: {
    min: 'Int!',
    max: 'Int!',
  },
  Query: {
    artists: '[Artist!]!',
    artist: 'Artist',
    artistsByCategory: '[Artist!]!',
    artistsByLocation: '[Artist!]!',
  },
};

// Simple GraphQL query parser
function parseQuery(query: string) {
  // Extract field names from GraphQL query
  const fieldMatch = query.match(/\{([^}]+)\}/);
  if (!fieldMatch) return [];
  
  return fieldMatch[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.replace(/\s*\{.*$/, '').trim());
}

// GraphQL resolver functions
const resolvers = {
  artists: () => artists,
  artist: (args: { id: string }) => artists.find(a => a.id === args.id),
  artistsByCategory: (args: { category: string }) => 
    artists.filter(a => a.categories.includes(args.category)),
  artistsByLocation: (args: { location: string }) =>
    artists.filter(a => a.location.toLowerCase().includes(args.location.toLowerCase())),
};

/**
 * Simulates a GraphQL endpoint
 * Supports basic queries for artists data
 */
export async function graphqlRequest<T = any>(query: GraphQLQuery): Promise<GraphQLResponse<T>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const { query: queryString, variables = {} } = query;
    
    // Parse the query to determine what data to return
    const fields = parseQuery(queryString);
    
    // Determine the operation type and field
    let operation = 'artists';
    if (queryString.includes('artist(')) {
      operation = 'artist';
    } else if (queryString.includes('artistsByCategory')) {
      operation = 'artistsByCategory';
    } else if (queryString.includes('artistsByLocation')) {
      operation = 'artistsByLocation';
    }

    // Execute the resolver
    const resolver = resolvers[operation as keyof typeof resolvers];
    if (!resolver) {
      throw new Error(`Unknown operation: ${operation}`);
    }

    const data = resolver(variables as any);
    
    // Filter the response based on requested fields
    if (Array.isArray(data)) {
      const filteredData = data.map(artist => {
        const filtered: Partial<Artist> = {};
        fields.forEach(field => {
          if (field in artist) {
            (filtered as any)[field] = (artist as any)[field];
          }
        });
        return filtered;
      });
      return { data: filteredData as T };
    } else if (data) {
      const filtered: Partial<Artist> = {};
      fields.forEach(field => {
        if (field in data) {
          (filtered as any)[field] = (data as any)[field];
        }
      });
      return { data: filtered as T };
    } else {
      return { data: null as T };
    }
  } catch (error) {
    return {
      data: null as T,
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}

// Predefined GraphQL queries
export const queries = {
  getAllArtists: `
    query GetAllArtists {
      artists {
        id
        name
        categories
        location
        priceRange {
          min
          max
        }
        bio
        imageUrl
        languages
      }
    }
  `,
  
  getArtistById: `
    query GetArtistById($id: String!) {
      artist(id: $id) {
        id
        name
        categories
        location
        priceRange {
          min
          max
        }
        bio
        imageUrl
        languages
      }
    }
  `,
  
  getArtistsByCategory: `
    query GetArtistsByCategory($category: String!) {
      artistsByCategory(category: $category) {
        id
        name
        categories
        location
        priceRange {
          min
          max
        }
        imageUrl
      }
    }
  `,
  
  getArtistsByLocation: `
    query GetArtistsByLocation($location: String!) {
      artistsByLocation(location: $location) {
        id
        name
        categories
        location
        priceRange {
          min
          max
        }
        imageUrl
      }
    }
  `,
};

// Hook for using GraphQL in components
export function useGraphQL() {
  return {
    query: graphqlRequest,
    queries,
  };
} 