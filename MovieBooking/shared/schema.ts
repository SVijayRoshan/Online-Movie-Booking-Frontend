import { z } from "zod";

// User schema
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

// Movie schema
export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  duration: z.number(),
  rating: z.string(),
  poster: z.string(),
});

// Booking schema
export const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  movieId: z.string(),
  showTime: z.string(),
  seats: z.array(z.string()),
  totalPrice: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;
export type Movie = z.infer<typeof movieSchema>;
export type Booking = z.infer<typeof bookingSchema>;
