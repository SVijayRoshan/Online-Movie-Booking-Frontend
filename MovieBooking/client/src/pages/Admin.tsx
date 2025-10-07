import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function AdminContent() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [genres, setGenres] = useState('');
  const [rating, setRating] = useState('');

  const { data: movies, isLoading } = useQuery({
    queryKey: ['/api/movies'],
    queryFn: () => api.getMovies(),
  });

  const addMovieMutation = useMutation({
    mutationFn: () => api.addMovie({
      title,
      synopsis,
      posterUrl,
      duration: parseInt(duration),
      genres: genres.split(',').map(g => g.trim()),
      rating: parseFloat(rating),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      toast({
        title: 'Movie added',
        description: 'The movie has been added successfully',
      });
      setIsDialogOpen(false);
      setTitle('');
      setSynopsis('');
      setPosterUrl('');
      setDuration('');
      setGenres('');
      setRating('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add movie',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id: string) => api.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      toast({
        title: 'Movie deleted',
        description: 'The movie has been removed',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete movie',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovieMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-movie">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Movie</DialogTitle>
                <DialogDescription>
                  Add a new movie to the catalog
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <Label htmlFor="synopsis">Synopsis</Label>
                  <Textarea
                    id="synopsis"
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    required
                    data-testid="input-synopsis"
                  />
                </div>

                <div>
                  <Label htmlFor="posterUrl">Poster URL</Label>
                  <Input
                    id="posterUrl"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    required
                    data-testid="input-poster-url"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      data-testid="input-duration"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating (0-10)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                      data-testid="input-rating"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="genres">Genres (comma-separated)</Label>
                  <Input
                    id="genres"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    placeholder="Action, Drama, Sci-Fi"
                    required
                    data-testid="input-genres"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={addMovieMutation.isPending}
                  data-testid="button-submit-movie"
                >
                  {addMovieMutation.isPending ? 'Adding...' : 'Add Movie'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {movies?.map((movie) => (
              <Card key={movie.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-movie-title-${movie.id}`}>
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {movie.synopsis}
                    </p>
                    <div className="flex gap-2 text-sm">
                      <span>{movie.duration} min</span>
                      <span>•</span>
                      <span>Rating: {movie.rating}</span>
                      <span>•</span>
                      <span>{movie.genres.join(', ')}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMovieMutation.mutate(movie.id)}
                    disabled={deleteMovieMutation.isPending}
                    data-testid={`button-delete-${movie.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
