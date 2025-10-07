import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { api } from '@/services/api';
import { Header } from '@/components/Header';
import { SeatGrid } from '@/components/SeatGrid';
import { SeatLegend } from '@/components/SeatLegend';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function SeatSelection() {
  const { showId } = useParams<{ showId: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [lockExpiry, setLockExpiry] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const { data: show, isLoading, refetch } = useQuery({
    queryKey: ['/api/shows', showId],
    queryFn: () => api.getShow(showId!),
    enabled: !!showId,
    refetchInterval: 5000,
  });

  const lockMutation = useMutation({
    mutationFn: (seatIds: string[]) => api.lockSeats(showId!, { seatIds, holdSeconds: 300 }),
    onSuccess: (data) => {
      if (data.failedSeats.length > 0) {
        toast({
          title: 'Some seats could not be locked',
          description: `Failed to lock: ${data.failedSeats.join(', ')}. Please select other seats.`,
          variant: 'destructive',
        });
        setSelectedSeats(prev => prev.filter(id => !data.failedSeats.includes(id)));
        refetch();
      } else {
        setLockExpiry(new Date(data.expiresAt));
        setLocation(`/checkout?showId=${showId}&lockToken=${data.lockToken}&seats=${data.lockedSeats.join(',')}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Lock failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!lockExpiry) return;
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((lockExpiry.getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        toast({
          title: 'Lock expired',
          description: 'Please select your seats again',
          variant: 'destructive',
        });
        setLockExpiry(null);
        setSelectedSeats([]);
        refetch();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockExpiry, toast, refetch]);

  const handleSeatSelect = useCallback((seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      return [...prev, seatId];
    });
  }, []);

  const handleLockSeats = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to continue',
      });
      setLocation('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: 'No seats selected',
        description: 'Please select at least one seat',
        variant: 'destructive',
      });
      return;
    }

    lockMutation.mutate(selectedSeats);
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = show?.seatsLayout.find(s => s.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Show not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-show-info">
            {show.theatre}
          </h1>
          <p className="text-muted-foreground">
            {new Date(show.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {show.time}
          </p>
        </div>

        {lockExpiry && timeRemaining > 0 && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Seats locked. Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </AlertDescription>
          </Alert>
        )}

        <SeatLegend />

        <div className="my-8">
          <SeatGrid 
            seats={show.seatsLayout} 
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm text-muted-foreground">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
              </div>
              <div className="text-2xl font-bold" data-testid="text-total-price">
                {formatPrice(totalPrice)}
              </div>
            </div>
            
            <Button
              size="lg"
              onClick={handleLockSeats}
              disabled={selectedSeats.length === 0 || lockMutation.isPending}
              data-testid="button-lock-seats"
            >
              <Lock className="w-4 h-4 mr-2" />
              {lockMutation.isPending ? 'Locking...' : 'Lock Seats & Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
