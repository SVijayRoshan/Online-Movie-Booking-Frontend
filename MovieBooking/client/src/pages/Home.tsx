import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MovieCard } from '@/components/MovieCard';
import { Header } from '@/components/Header';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const { data: movies, isLoading } = useQuery({
    queryKey: ['/api/movies'],
    queryFn: () => api.getMovies(),
  });

  const allGenres = useMemo(() => {
    if (!movies) return [];
    const genres = new Set<string>();
    movies.forEach(movie => movie.genres.forEach(genre => genres.add(genre)));
    return Array.from(genres).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    
    let filtered = movies;
    
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.synopsis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGenre && selectedGenre !== 'all') {
      filtered = filtered.filter(movie => movie.genres.includes(selectedGenre));
    }
    
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'new') {
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }
    
    return filtered;
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSortBy('popular');
  };

  const hasActiveFilters = searchTerm || selectedGenre !== 'all' || sortBy !== 'popular';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-16">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
              Your Ticket to
              <span className="text-primary"> Cinematic Moments</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover trending films, pick the best seats, and book in seconds
            </p>
          </div>
        </div>

        {movies && movies.length > 0 && (
          <div className="pb-10">
            <FeaturedCarousel movies={movies} />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card p-4 rounded-lg shadow-lg space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search Movies</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Genre</label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger data-testid="select-genre">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="new">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="md:mb-0"
              data-testid="button-clear-filters"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover-elevate rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedGenre !== 'all' && (
              <Badge variant="secondary">
                Genre: {selectedGenre}
                <button
                  onClick={() => setSelectedGenre('all')}
                  className="ml-2 hover-elevate rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

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
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
