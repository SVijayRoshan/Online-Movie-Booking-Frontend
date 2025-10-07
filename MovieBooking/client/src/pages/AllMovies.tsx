import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';

export default function AllMovies() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['/api/movies'],
    queryFn: () => api.getMovies(),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    const list = movies || [];
    let out = list;
    if (searchTerm) {
      out = out.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortBy === 'popular') {
      out = [...out].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'az') {
      out = [...out].sort((a, b) => a.title.localeCompare(b.title));
    }
    return out;
  }, [movies, searchTerm, sortBy]);

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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative">
        <div className="h-48 md:h-64 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="grid grid-cols-5 gap-1 opacity-60">
            {(movies || []).slice(0, 15).map((m) => (
              <img key={m.id} src={toProxiedUrl(m.posterUrl)} alt={m.title} className="w-full h-48 md:h-64 object-cover" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-end z-20">
          <div className="max-w-7xl mx-auto px-4 pb-4 w-full">
            <h1 className="text-3xl md:text-4xl font-bold font-display">All Movies</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-end mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search movies..." />
          </div>
          <div className="w-full md:w-52">
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


