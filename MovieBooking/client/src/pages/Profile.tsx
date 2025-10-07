import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, MapPin, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Booking } from '@/types';

function BookingCard({ booking }: { booking: Booking }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket - ${booking.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
              h1 { text-align: center; }
              .info { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <h1>${booking.movieTitle || 'Movie Ticket'}</h1>
              <div class="info"><strong>Booking ID:</strong> ${booking.id}</div>
              <div class="info"><strong>Theatre:</strong> ${booking.theatre}</div>
              <div class="info"><strong>Date:</strong> ${new Date(booking.showDate || '').toLocaleDateString()}</div>
              <div class="info"><strong>Time:</strong> ${booking.showTime}</div>
              <div class="info"><strong>Seats:</strong> ${booking.seats.map(s => s.id).join(', ')}</div>
              <div class="info"><strong>Total:</strong> ₹${booking.total.toLocaleString('en-IN')}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg" data-testid={`text-movie-${booking.id}`}>
            {booking.movieTitle || 'Movie'}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-booking-id-${booking.id}`}>
            Booking ID: {booking.id}
          </p>
        </div>
        <Badge variant="secondary">Confirmed</Badge>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-theatre-${booking.id}`}>{booking.theatre}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-date-${booking.id}`}>
            {booking.showDate ? new Date(booking.showDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-time-${booking.id}`}>{booking.showTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-seats-${booking.id}`}>
            Seats: {booking.seats.map(s => s.id).join(', ')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-lg font-bold" data-testid={`text-total-${booking.id}`}>
          {formatPrice(booking.total)}
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint} data-testid={`button-print-${booking.id}`}>
          Print Ticket
        </Button>
      </div>
    </Card>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings', user?.id],
    queryFn: () => api.getBookings(user!.id),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-user-name">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground" data-testid="text-user-email">{user?.email}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Bookings</h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground">
                Start exploring movies and make your first booking!
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
