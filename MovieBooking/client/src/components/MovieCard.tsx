import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'wouter';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
}

function toProxiedUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    if (
      host === 'upload.wikimedia.org' ||
      host === 'static.wikia.nocookie.net' ||
      host === 'image.tmdb.org' ||
      host === 'm.media-amazon.com'
    ) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  } catch {
    return url;
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full flex flex-col">
        <div className="aspect-[2/3] overflow-hidden bg-muted relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          <img
            src={toProxiedUrl(movie.posterUrl)}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // If proxy failed, try direct image as fallback
              if (target.src.startsWith('/api/proxy')) {
                target.src = movie.posterUrl;
                return;
              }
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect fill='%23334155' width='400' height='600'/%3E%3Ctext fill='%23fff' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(movie.title)}%3C/text%3E%3C/svg%3E`;
            }}
            data-testid={`img-poster-${movie.id}`}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="text-lg font-semibold text-white line-clamp-2" data-testid={`text-title-${movie.id}`}>
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-chart-2 text-chart-2" />
                <span className="text-sm text-white" data-testid={`text-rating-${movie.id}`}>
                  {movie.rating}
                </span>
              </div>
              <span className="text-sm text-white/80">{movie.duration} min</span>
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs" data-testid={`badge-genre-${genre}`}>
                {genre}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {movie.synopsis}
          </p>
          <Button className="w-full mt-4" data-testid={`button-book-${movie.id}`}>
            Book Now
          </Button>
        </div>
      </Card>
    </Link>
  );
}
