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
    title: 'Man of Steel',
    synopsis: 'Clark Kent discovers his origins and becomes Superman to protect Earth from a formidable Kryptonian threat.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7rIPjn5TUK04O25ZkMyHrGNPgLx.jpg',
    duration: 143,
    genres: ['English', 'Action', 'Sci-Fi'],
    rating: 7.1,
    shows: [],
  },
  {
    id: 'E-2',
    title: 'The Dark Knight',
    synopsis: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
    duration: 152,
    genres: ['English', 'Action', 'Crime'],
    rating: 9.0,
    shows: [],
  },
  {
    id: 'E-3',
    title: 'Interstellar',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    duration: 169,
    genres: ['English', 'Sci-Fi', 'Adventure'],
    rating: 8.6,
    shows: [],
  },
  {
    id: 'E-4',
    title: 'Titanic',
    synopsis: 'A romance blossoms aboard the ill-fated RMS Titanic.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    duration: 194,
    genres: ['English', 'Drama', 'Romance'],
    rating: 7.9,
    shows: [],
  },
  {
    id: 'E-5',
    title: 'Avatar',
    synopsis: 'A paraplegic Marine is dispatched to the moon Pandora on a unique mission.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
    duration: 162,
    genres: ['English', 'Sci-Fi', 'Adventure'],
    rating: 7.8,
    shows: [],
  },
  // Anime movies
  {
    id: 'A-1',
    title: 'Spirited Away',
    synopsis: 'A young girl enters a world of spirits and must find a way to free her parents.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    duration: 125,
    genres: ['Anime', 'Fantasy', 'Adventure'],
    rating: 8.6,
    shows: [],
  },
  {
    id: 'A-2',
    title: 'Your Name',
    synopsis: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png',
    duration: 106,
    genres: ['Anime', 'Romance', 'Fantasy'],
    rating: 8.4,
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
  // Requested additions
  {
    id: 'E-16',
    title: 'Spider-Man: No Way Home',
    synopsis: 'Peter Parker seeks help from Doctor Strange, but a spell gone wrong opens the multiverse to new threats.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    duration: 148,
    genres: ['English', 'Action', 'Sci-Fi'],
    rating: 8.2,
    shows: [],
  },
  {
    id: 'E-6',
    title: 'Furious 7',
    synopsis: 'Dominic Toretto and his crew face a new threat from a vengeful special ops assassin.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b8/Furious_7_poster.jpg',
    duration: 137,
    genres: ['English', 'Action', 'Thriller'],
    rating: 7.1,
    shows: [],
  },
  {
    id: 'E-7',
    title: 'Cars',
    synopsis: 'Lightning McQueen learns that life is about the journey, not just the finish line.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/34/Cars_2006.jpg',
    duration: 117,
    genres: ['English', 'Animation', 'Family'],
    rating: 7.2,
    shows: [],
  },
  {
    id: 'E-8',
    title: 'The Matrix',
    synopsis: 'A hacker discovers the true nature of reality and his role in the war against its controllers.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    duration: 136,
    genres: ['English', 'Sci-Fi', 'Action'],
    rating: 8.7,
    shows: [],
  },
  {
    id: 'E-9',
    title: 'The Godfather',
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
    duration: 175,
    genres: ['English', 'Crime', 'Drama'],
    rating: 9.2,
    shows: [],
  },
  {
    id: 'E-10',
    title: 'Pulp Fiction',
    synopsis: 'The lives of two mob hitmen, a boxer, and others intertwine in tales of violence and redemption.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    duration: 154,
    genres: ['English', 'Crime', 'Drama'],
    rating: 8.9,
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
    id: 'E-12',
    title: 'The Shawshank Redemption',
    synopsis: 'Two imprisoned men bond over years, finding solace and eventual redemption.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg',
    duration: 142,
    genres: ['English', 'Drama'],
    rating: 9.3,
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
    id: 'E-14',
    title: 'Jurassic Park',
    synopsis: 'A preview tour of a theme park with cloned dinosaurs turns deadly.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg',
    duration: 127,
    genres: ['English', 'Adventure', 'Sci-Fi'],
    rating: 8.2,
    shows: [],
  },
  {
    id: 'E-15',
    title: 'Back to the Future',
    synopsis: 'A teenager travels back in time and must ensure his parents fall in love to save his existence.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg',
    duration: 116,
    genres: ['English', 'Adventure', 'Sci-Fi'],
    rating: 8.5,
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

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
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
