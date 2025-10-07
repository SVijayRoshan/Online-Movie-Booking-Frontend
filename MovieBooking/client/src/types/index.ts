export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl: string;
  duration: number;
  genres: string[];
  rating: number;
  shows: Show[];
}

export interface Show {
  id: string;
  movieId: string;
  theatre: string;
  date: string;
  time: string;
  price: number;
  seatsLayout?: Seat[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  state: 'available' | 'booked' | 'locked';
  price: number;
}

export interface LockSeatsRequest {
  seatIds: string[];
  holdSeconds?: number;
}

export interface LockSeatsResponse {
  lockToken: string;
  lockedSeats: string[];
  failedSeats: string[];
  expiresAt: string;
}

export interface CreateBookingRequest {
  userId: string;
  showId: string;
  seatIds: string[];
  lockToken: string;
}

export interface BookingSeat {
  id: string;
  row: string;
  number: number;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  movieTitle?: string;
  theatre?: string;
  showDate?: string;
  showTime?: string;
  seats: BookingSeat[];
  total: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
