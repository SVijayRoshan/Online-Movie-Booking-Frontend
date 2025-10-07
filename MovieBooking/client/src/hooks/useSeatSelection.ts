import { useState, useCallback } from 'react';
import type { Seat } from '@/types';

export function useSeatSelection(maxSeats?: number) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = useCallback((seatId: string, isAvailable: boolean) => {
    if (!isAvailable) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      
      if (maxSeats && prev.length >= maxSeats) {
        return prev;
      }
      
      return [...prev, seatId];
    });
  }, [maxSeats]);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const calculateTotal = useCallback((seats: Seat[]) => {
    return selectedSeats.reduce((sum, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return sum + (seat?.price || 0);
    }, 0);
  }, [selectedSeats]);

  return {
    selectedSeats,
    toggleSeat,
    clearSelection,
    calculateTotal,
  };
}
