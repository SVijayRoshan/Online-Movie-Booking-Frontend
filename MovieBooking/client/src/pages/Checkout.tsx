import { useState, useEffect } from 'react';
import { useLocation as useWouterLocation, useSearch } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient';

function CheckoutContent() {
  const searchString = useSearch();
  const [, setLocation] = useWouterLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const params = new URLSearchParams(searchString);
  const showId = params.get('showId');
  const lockToken = params.get('lockToken');
  const seatIds = params.get('seats')?.split(',') || [];

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'success' | 'fail'>('success');

  const { data: show } = useQuery({
    queryKey: ['/api/shows', showId],
    queryFn: () => api.getShow(showId!),
    enabled: !!showId,
  });

  const selectedSeats = show?.seatsLayout.filter(seat => seatIds.includes(seat.id)) || [];
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (paymentMode === 'fail') {
        throw new Error('Payment failed. Please try again.');
      }
      
      return api.createBooking({
        userId: user!.id,
        showId: showId!,
        seatIds,
        lockToken: lockToken!,
      });
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking confirmed!',
        description: `Your booking ID is ${booking.id}`,
      });
      setLocation('/profile');
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    bookingMutation.mutate();
  };

  if (!showId || !lockToken || seatIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Invalid checkout session</h2>
          <Button onClick={() => setLocation('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theatre</span>
                  <span className="font-medium" data-testid="text-theatre">{show?.theatre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium" data-testid="text-date">
                    {show?.date ? new Date(show.date).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium" data-testid="text-time">{show?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium" data-testid="text-seats">
                    {selectedSeats.map(s => s.id).join(', ')}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span data-testid="text-total">{formatPrice(total)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Simulation</h2>
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="payment-mode" className="flex-1">
                  <div className="font-medium">Payment Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Toggle to simulate {paymentMode === 'success' ? 'failure' : 'success'}
                  </div>
                </Label>
                <div className="flex items-center gap-3">
                  <span className={paymentMode === 'fail' ? 'font-semibold' : 'text-muted-foreground'}>
                    Fail
                  </span>
                  <Switch
                    id="payment-mode"
                    checked={paymentMode === 'success'}
                    onCheckedChange={(checked) => setPaymentMode(checked ? 'success' : 'fail')}
                    data-testid="switch-payment-mode"
                  />
                  <span className={paymentMode === 'success' ? 'font-semibold' : 'text-muted-foreground'}>
                    Success
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    data-testid="input-phone"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={bookingMutation.isPending}
                  data-testid="button-confirm-booking"
                >
                  {bookingMutation.isPending ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
