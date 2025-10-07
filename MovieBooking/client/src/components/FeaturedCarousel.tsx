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
      const directHosts = new Set([
        'upload.wikimedia.org',
        'image.tmdb.org',
        'm.media-amazon.com',
        'static.wikia.nocookie.net',
      ]);
      if (directHosts.has(host)) {
        return url;
      }
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    } catch {
      return url;
    }
  }

  function getPosterCandidates(title: string, primary: string): string[] {
    const map: Record<string, string[]> = {
'Man of Steel': [
        'https://image.tmdb.org/t/p/w500/7rIPjn5TUK04O25ZkMyHrGNPgLx.jpg',
        'https://upload.wikimedia.org/wikipedia/en/8/85/Man_of_Steel_2013_theatrical_poster.jpg',
      ],
'Demon Slayer: Infinity Castle': [
        'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhSY.jpg',
      ],
      'Demon Slayer: Mugen Train': [
        'https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeUU.jpg',
        'https://upload.wikimedia.org/wikipedia/en/2/2f/Demon_Slayer_-_Kimetsu_no_Yaiba_-_The_Movie_Mugen_Train_poster.png',
      ],
'One Piece Film: Red': [
        'https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg',
        'https://upload.wikimedia.org/wikipedia/en/7/7b/One_Piece_Film_Red_poster.jpg',
      ],
      'Spider-Man: No Way Home': [
        'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        'https://upload.wikimedia.org/wikipedia/en/8/8a/Spider-Man_No_Way_Home_poster.jpg',
      ],
      'Titanic': [
        'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        'https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg',
      ],
    };
    const list = map[title] || [];
    if (primary && !list.includes(primary)) return [primary, ...list];
    return list.length ? list : [primary];
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
          {featured.map((movie) => {
            const candidates = getPosterCandidates(movie.title, movie.posterUrl);
            return (
            <CarouselItem key={movie.id} className="md:basis-[66%] lg:basis-1/2 xl:basis-1/3">
              <Link href={`/movie/${movie.id}`}>
                <Card className="group overflow-hidden hover-elevate cursor-pointer">
                  <div className="aspect-[21/9] md:aspect-[16/9] overflow-hidden bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />
                    <img
                      src={toProxiedUrl(candidates[0])}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      data-idx={0}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const currentIdx = parseInt(target.getAttribute('data-idx') || '0', 10);
                        const nextIdx = currentIdx + 1;
                        if (nextIdx < candidates.length) {
                          target.setAttribute('data-idx', String(nextIdx));
                          target.src = toProxiedUrl(candidates[nextIdx]);
                          return;
                        }
                        if (target.src.startsWith('/api/proxy')) {
                          target.src = candidates[currentIdx] || movie.posterUrl;
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
          );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}


