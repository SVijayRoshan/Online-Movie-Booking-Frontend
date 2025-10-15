import type {
  Movie,
  Show,
  Seat,
  LockSeatsRequest,
  LockSeatsResponse,
  CreateBookingRequest,
  Booking,
  AuthResponse,
} from '@/types';
import { mockApi } from './mockApi';

const API_BASE_URL = 'http://localhost:5000/api';

const USE_MOCK_API = false; // <<-- change this to false once backend is ready

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  getMovies: async (): Promise<Movie[]> => {
    if (USE_MOCK_API) return mockApi.getMovies();
    return fetchApi<Movie[]>('/movies');
  },

  getMovie: async (id: string): Promise<Movie | null> => {
    if (USE_MOCK_API) return mockApi.getMovie(id);
    return fetchApi<Movie>(`/movies/${id}`);
  },

  getShow: async (id: string): Promise<(Show & { seatsLayout: Seat[] }) | null> => {
    if (USE_MOCK_API) return mockApi.getShow(id);
    return fetchApi<Show & { seatsLayout: Seat[] }>(`/shows/${id}`);
  },

  lockSeats: async (showId: string, request: LockSeatsRequest): Promise<LockSeatsResponse> => {
    if (USE_MOCK_API) return mockApi.lockSeats(showId, request);
    return fetchApi<LockSeatsResponse>(`/shows/${showId}/lock`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  createBooking: async (request: CreateBookingRequest): Promise<Booking> => {
    if (USE_MOCK_API) return mockApi.createBooking(request);
    return fetchApi<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getBookings: async (userId: string): Promise<Booking[]> => {
    if (USE_MOCK_API) return mockApi.getBookings(userId);
    return fetchApi<Booking[]>(`/bookings?userId=${userId}`);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string, phone: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  },

  addMovie: async (movie: Omit<Movie, 'id' | 'shows'>): Promise<Movie> => {
    if (USE_MOCK_API) return mockApi.addMovie(movie);
    return fetchApi<Movie>('/admin/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
    });
  },

  deleteMovie: async (id: string): Promise<void> => {
    if (USE_MOCK_API) return mockApi.deleteMovie(id);
    return fetchApi<void>(`/admin/movies/${id}`, { method: 'DELETE' });
  },
};
