import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { api } from '@/services/api';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Clock, Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Show } from '@/types';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { data: movie, isLoading } = useQuery({
    queryKey: ['/api/movies', id],
    queryFn: () => api.getMovie(id!),
    enabled: !!id,
  });

  const availableDates = useMemo(() => {
    if (!movie?.shows) return [];
    const dates = Array.from(new Set(movie.shows.map(show => show.date))).sort();
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
    return dates;
  }, [movie?.shows, selectedDate]);

  const showsByTheatre = useMemo(() => {
    if (!movie?.shows || !selectedDate) return new Map<string, Show[]>();
    
    const shows = movie.shows.filter(show => show.date === selectedDate);
    const grouped = new Map<string, Show[]>();
    
    shows.forEach(show => {
      if (!grouped.has(show.theatre)) {
        grouped.set(show.theatre, []);
      }
      grouped.get(show.theatre)!.push(show);
    });
    
    grouped.forEach(shows => {
      shows.sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return grouped;
  }, [movie?.shows, selectedDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse">
          <div className="h-96 bg-muted" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Movie not found</h2>
        </div>
      </div>
    );
  }

  function toProxiedUrl(url: string): string {
    try {
      const host = new URL(url).hostname;
      if (host === 'upload.wikimedia.org' || host === 'static.wikia.nocookie.net') {
        return `/api/proxy?url=${encodeURIComponent(url)}`;
      }
      return url;
    } catch {
      return url;
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative h-[50vh] overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img
          src={toProxiedUrl(movie.posterUrl)}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30 blur-sm scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src={toProxiedUrl(movie.posterUrl)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect fill='%23334155' width='400' height='600'/%3E%3Ctext fill='%23fff' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(movie.title)}%3C/text%3E%3C/svg%3E`;
                  }}
                  data-testid="img-movie-poster"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-display" data-testid="text-movie-title">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-chart-2 text-chart-2" />
                    <span className="font-semibold" data-testid="text-movie-rating">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span data-testid="text-movie-duration">{movie.duration} min</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
          <p className="text-muted-foreground leading-relaxed" data-testid="text-synopsis">
            {movie.synopsis}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Select Showtime</h2>
          
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(date)}
                  className="flex-shrink-0"
                  data-testid={`button-date-${date}`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(date)}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-6">
              {Array.from(showsByTheatre.entries()).map(([theatre, shows]) => (
                <Card key={theatre} className="p-6">
                  <h3 className="font-semibold text-lg mb-4" data-testid={`text-theatre-${theatre}`}>
                    {theatre}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {shows.map((show) => (
                      <Link key={show.id} href={`/seats/${show.id}`}>
                        <Button variant="outline" className="min-w-[120px]" data-testid={`button-show-${show.id}`}>
                          <div className="text-left">
                            <div className="font-semibold">{show.time}</div>
                            <div className="text-xs text-muted-foreground">${show.price}</div>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
