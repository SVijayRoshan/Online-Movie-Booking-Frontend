import { useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import type { Seat } from '@/types';
import { cn } from '@/lib/utils';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const SeatButton = memo(({ 
  seat, 
  isSelected, 
  onSelect 
}: { 
  seat: Seat; 
  isSelected: boolean; 
  onSelect: (id: string) => void;
}) => {
  const handleClick = () => {
    if (seat.state === 'available' || isSelected) {
      onSelect(seat.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getVariant = () => {
    if (isSelected) return 'default';
    if (seat.state === 'booked') return 'secondary';
    if (seat.state === 'locked') return 'outline';
    return 'ghost';
  };

  const getAriaLabel = () => {
    return `Seat ${seat.row}${seat.number}, ${seat.state}${isSelected ? ', selected' : ''}`;
  };

  return (
    <Button
      variant={getVariant()}
      size="sm"
      className={cn(
        'min-w-[44px] min-h-[44px] p-2 text-xs font-medium',
        seat.state === 'booked' && 'cursor-not-allowed opacity-50',
        seat.state === 'locked' && 'cursor-not-allowed opacity-70 border-chart-5',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={seat.state === 'booked' || seat.state === 'locked'}
      aria-label={getAriaLabel()}
      aria-pressed={isSelected}
      data-testid={`seat-${seat.id}`}
    >
      {seat.row}{seat.number}
    </Button>
  );
});

SeatButton.displayName = 'SeatButton';

export function SeatGrid({ seats, selectedSeats, onSeatSelect }: SeatGridProps) {
  const seatsByRow = useMemo(() => {
    const rows = new Map<string, Seat[]>();
    seats.forEach(seat => {
      if (!rows.has(seat.row)) {
        rows.set(seat.row, []);
      }
      rows.get(seat.row)!.push(seat);
    });
    
    Array.from(rows.values()).forEach(rowSeats => {
      rowSeats.sort((a, b) => a.number - b.number);
    });
    
    return rows;
  }, [seats]);

  const handleSeatSelect = useCallback((seatId: string) => {
    onSeatSelect(seatId);
  }, [onSeatSelect]);

  return (
    <div className="space-y-4">
      <div className="text-center py-4 border-b-4 border-muted rounded-lg mb-8">
        <p className="text-sm font-semibold text-muted-foreground tracking-wider">SCREEN</p>
      </div>

      <div className="space-y-2 max-w-4xl mx-auto">
        {Array.from(seatsByRow.entries()).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2 justify-center">
            <div className="w-8 text-center font-semibold text-muted-foreground text-sm">
              {row}
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {rowSeats.map(seat => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.id)}
                  onSelect={handleSeatSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
