import { useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { Movie } from '@/types';
import { Link } from 'wouter';

interface FeaturedCarouselProps {
  movies: Movie[];
}

export function FeaturedCarousel({ movies }: FeaturedCarouselProps) {
  const featured = useMemo(() => {
    return [...movies]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [movies]);

  if (!featured.length) return null;

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

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-2xl font-semibold">Featured Movies</h2>
        <Link href="/movies">
          <span className="text-sm text-primary hover:underline cursor-pointer">View All</span>
        </Link>
      </div>
      <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
        <CarouselContent>
          {featured.map((movie) => (
            <CarouselItem key={movie.id} className="md:basis-[66%] lg:basis-1/2 xl:basis-1/3">
              <Link href={`/movie/${movie.id}`}>
                <Card className="group overflow-hidden hover-elevate cursor-pointer">
                  <div className="aspect-[21/9] md:aspect-[16/9] overflow-hidden bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />
                    <img
                      src={toProxiedUrl(movie.posterUrl)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.startsWith('/api/proxy')) {
                          target.src = movie.posterUrl;
                          return;
                        }
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="text-xl font-semibold text-white line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-white">
                          <Star className="w-4 h-4 fill-chart-2 text-chart-2" />
                          <span className="text-sm font-semibold">{movie.rating}</span>
                        </div>
                        <span className="text-sm text-white/90">{movie.duration} min</span>
                      </div>
                      <Button size="sm" className="mt-3">Book Now</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}


