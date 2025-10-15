import type {
  Movie,
  Show,
  Seat,
  LockSeatsRequest,
  LockSeatsResponse,
  CreateBookingRequest,
  Booking,
  User,
  AuthResponse,
} from '@/types';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 10;

function generateSeats(price: number): Seat[] {
  const seats: Seat[] = [];
  SEAT_ROWS.forEach((row) => {
    for (let num = 1; num <= SEATS_PER_ROW; num++) {
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        state: 'available',
        price,
      });
    }
  });

  return seats;
}

const mockMovies: Movie[] = [
  // English movies
  {
    id: 'E-1',
    title: 'Dude',
    synopsis: 'Dude is 2025 Tamil-language romantic action comedy film written and directed by Keerthiswaran.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/de/Dude_%282025%29_Poster.jpeg',
    duration: 140,
    genres: ['Comedy', 'Action', 'Romance', 'Drama'],
    rating: 0,
    shows: [],
  },
  {
    id: 'E-2',
    title: 'Bison: Kaalamaadan',
    synopsis: 'A young man fights to overcome violence plaguing his village and succeed as a professional kabaddi player.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Bison_2025_poster.jpg',
    duration: 169,
    genres: ['Biography', 'Action', 'Drama'],
    rating: 0,
    shows: [],
  },
  {
    id: 'E-3',
    title: 'Kantara: Chapter 1',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/6/69/Kantara-_Chapter_1_poster.jpg',
    duration: 168,
    genres: ['Drama', 'Thriller', 'Adventure'],
    rating: 8.6,
    shows: [],
  },
  {
    id: 'E-4',
    title: 'Idli Kadai',
    synopsis: 'A man search for success leads him to rediscover his roots.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/14/Idly_Kadai.jpg',
    duration: 194,
    genres: ['Action', 'Drama', 'Family'],
    rating: 7.9,
    shows: [],
  },
  {
    id: 'A-3',
    title: 'Demon Slayer: Infinity Castle',
    synopsis: 'Tanjiro and his allies confront Muzan in the Infinity Castle in a climactic battle across shifting domains.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/yF8acglZWjMgmdaJuLIZjdlbTYd.jpg',
    duration: 130,
    genres: ['Anime', 'Action', 'Fantasy'],
    rating: 8.2,
    shows: [],
  },
  {
    id: 'E-11',
    title: 'Fight Club',
    synopsis: 'An insomniac office worker and a soap maker form an underground fight club.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg',
    duration: 139,
    genres: ['English', 'Drama'],
    rating: 8.8,
    shows: [],
  },
  {
    id: 'E-13',
    title: 'Avengers: Endgame',
    synopsis: 'The Avengers assemble once more in order to reverse Thanos’ actions and restore balance.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
    duration: 181,
    genres: ['English', 'Action', 'Sci-Fi'],
    rating: 8.4,
    shows: [],
  },
  {
    id: 'A-6',
    title: 'One Piece Film: Red',
    synopsis: 'The Straw Hat Pirates attend a music festival where secrets about Shanks unfold.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg',
    duration: 115,
    genres: ['Anime', 'Adventure', 'Action'],
    rating: 6.8,
    shows: [],
  },
];

const theatres = ['Cineplex Downtown', 'StarView Mall', 'Grand Cinema', 'Metro Theater'];
const today = new Date();
const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  return date.toISOString().split('T')[0];
});

mockMovies.forEach((movie) => {
  dates.forEach((date) => {
    theatres.forEach((theatre) => {
      const times = ['10:00', '13:30', '17:00', '20:30'];
      times.forEach((time) => {
        const show: Show = {
          id: `${movie.id}-${date}-${theatre.replace(/\s/g, '')}-${time.replace(':', '')}`,
          movieId: movie.id,
          theatre,
          date,
          time,
          price: 300 + Math.floor(Math.random() * 500),
        };
        movie.shows.push(show);
      });
    });
  });
});

class MockApiService {
  private movies: Movie[] = JSON.parse(JSON.stringify(mockMovies));
  private shows: Map<string, Show & { seatsLayout: Seat[] }> = new Map();
  private bookings: Booking[] = [];
  private users: User[] = [];
  private userPasswordsByEmail: Map<string, string> = new Map();
  private locks: Map<string, { seatIds: string[]; expiresAt: Date; showId: string }> = new Map();

  constructor() {
    this.movies.forEach((movie) => {
      movie.shows.forEach((show) => {
        this.shows.set(show.id, {
          ...show,
          seatsLayout: generateSeats(show.price),
        });
      });
    });

    this.users.push({
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      phone: '9988776655'
    });
    this.userPasswordsByEmail.set('demo@example.com', 'password');
  }

  async getMovies(): Promise<Movie[]> {
    await this.delay(300);
    return this.movies.map(movie => ({
      ...movie,
      shows: movie.shows.map(({ seatsLayout, ...show }) => show)
    }));
  }

  async getMovie(id: string): Promise<Movie | null> {
    await this.delay(200);
    const movie = this.movies.find((m) => m.id === id);
    if (!movie) return null;
    return {
      ...movie,
      shows: movie.shows.map(({ seatsLayout, ...show }) => show)
    };
  }

  async getShow(id: string): Promise<(Show & { seatsLayout: Seat[] }) | null> {
    await this.delay(200);
    this.cleanExpiredLocks();
    const show = this.shows.get(id);
    if (!show) return null;
    return JSON.parse(JSON.stringify(show));
  }

  async lockSeats(showId: string, request: LockSeatsRequest): Promise<LockSeatsResponse> {
    await this.delay(400);
    this.cleanExpiredLocks();

    const show = this.shows.get(showId);
    if (!show) {
      throw new Error('Show not found');
    }

    const lockedSeats: string[] = [];
    const failedSeats: string[] = [];

    request.seatIds.forEach((seatId) => {
      const seat = show.seatsLayout.find((s) => s.id === seatId);
      if (!seat) {
        failedSeats.push(seatId);
      } else if (seat.state !== 'available') {
        failedSeats.push(seatId);
      } else {
        seat.state = 'locked';
        lockedSeats.push(seatId);
      }
    });

    const lockToken = `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const holdSeconds = request.holdSeconds || 300;
    const expiresAt = new Date(Date.now() + holdSeconds * 1000);

    if (lockedSeats.length > 0) {
      this.locks.set(lockToken, {
        seatIds: lockedSeats,
        expiresAt,
        showId,
      });
    }

    return {
      lockToken,
      lockedSeats,
      failedSeats,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    await this.delay(500);
    this.cleanExpiredLocks();

    const lock = this.locks.get(request.lockToken);
    if (!lock) {
      throw new Error('Invalid or expired lock token');
    }

    if (lock.showId !== request.showId) {
      throw new Error('Lock token does not match show');
    }

    const show = this.shows.get(request.showId);
    if (!show) {
      throw new Error('Show not found');
    }

    const movie = this.movies.find(m => m.id === show.movieId);

    const invalidSeats = request.seatIds.filter(
      (seatId) => !lock.seatIds.includes(seatId)
    );
    if (invalidSeats.length > 0) {
      throw new Error('Some seats are not locked with this token');
    }

    const seats: { id: string; row: string; number: number; price: number }[] = [];
    let total = 0;

    request.seatIds.forEach((seatId) => {
      const seat = show.seatsLayout.find((s) => s.id === seatId);
      if (seat && seat.state === 'locked') {
        seat.state = 'booked';
        seats.push({
          id: seat.id,
          row: seat.row,
          number: seat.number,
          price: seat.price,
        });
        total += seat.price;
      }
    });

    this.locks.delete(request.lockToken);

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      userId: request.userId,
      showId: request.showId,
      movieTitle: movie?.title,
      theatre: show.theatre,
      showDate: show.date,
      showTime: show.time,
      seats,
      total,
      createdAt: new Date().toISOString(),
    };

    this.bookings.push(booking);
    return booking;
  }

  async getBookings(userId: string): Promise<Booking[]> {
    await this.delay(200);
    return this.bookings.filter((b) => b.userId === userId);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.delay(300);
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    const stored = this.userPasswordsByEmail.get(email);
    if (!stored || stored !== password) {
      throw new Error('Invalid email or password');
    }
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { user, token };
  }

  async register(email: string, password: string, name: string, phone: string): Promise<AuthResponse> {
    await this.delay(300);
    if (this.users.find((u) => u.email === email)) {
      throw new Error('User already exists');
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error('Invalid email');
    }
    if ((password || '').length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      phone,
    };
    this.users.push(user);
    this.userPasswordsByEmail.set(email, password);
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { user, token };
  }

  async addMovie(movie: Omit<Movie, 'id' | 'shows'>): Promise<Movie> {
    await this.delay(300);
    const newMovie: Movie = {
      ...movie,
      id: `movie_${Date.now()}`,
      shows: [],
    };
    this.movies.push(newMovie);
    return newMovie;
  }

  async deleteMovie(id: string): Promise<void> {
    await this.delay(200);
    const index = this.movies.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
    }
  }

  private cleanExpiredLocks() {
    const now = new Date();
    this.locks.forEach((lock, token) => {
      if (lock.expiresAt < now) {
        const show = this.shows.get(lock.showId);
        if (show) {
          lock.seatIds.forEach((seatId) => {
            const seat = show.seatsLayout.find((s) => s.id === seatId);
            if (seat && seat.state === 'locked') {
              seat.state = 'available';
            }
          });
        }
        this.locks.delete(token);
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockApi = new MockApiService();
