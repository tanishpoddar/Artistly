'use client';

import * as React from 'react';
import { Artist } from '@/lib/types';

// Types for our global state
interface AppState {
  artists: Artist[];
  isLoading: boolean;
  filters: {
    category: string;
    location: string;
    price: [number, number];
  };
  theme: 'light' | 'dark' | 'system';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>;
}

// Action types
type AppAction =
  | { type: 'SET_ARTISTS'; payload: Artist[] }
  | { type: 'ADD_TEMPORARY_ARTIST'; payload: Artist }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppState['notifications'][0], 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_FILTERS' };

// Initial state
const initialState: AppState = {
  artists: [],
  isLoading: false,
  filters: {
    category: 'all',
    location: '',
    price: [0, 5000],
  },
  theme: 'system',
  notifications: [],
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ARTISTS':
      return { ...state, artists: action.payload };
    case 'ADD_TEMPORARY_ARTIST':
      return { ...state, artists: [...state.artists, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      return { ...state, notifications: [...state.notifications, newNotification] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    default:
      return state;
  }
}

// Context
const AppContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Helper hooks for specific state slices
export function useArtists() {
  const { state, dispatch } = useAppContext();
  return {
    artists: state.artists,
    isLoading: state.isLoading,
    setArtists: (artists: Artist[]) => dispatch({ type: 'SET_ARTISTS', payload: artists }),
    addTemporaryArtist: (artist: Artist) => dispatch({ type: 'ADD_TEMPORARY_ARTIST', payload: artist }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
  };
}

export function useFilters() {
  const { state, dispatch } = useAppContext();
  return {
    filters: state.filters,
    setFilters: (filters: Partial<AppState['filters']>) => 
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
  };
}

export function useNotifications() {
  const { state, dispatch } = useAppContext();
  return {
    notifications: state.notifications,
    addNotification: (notification: Omit<AppState['notifications'][0], 'id'>) =>
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) =>
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
  };
} 