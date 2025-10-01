import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSeatSelection } from './useSeatSelection';
import type { Seat } from '@/types';

describe('useSeatSelection', () => {
  const mockSeats: Seat[] = [
    { id: 'A1', row: 'A', number: 1, state: 'available', price: 12 },
    { id: 'A2', row: 'A', number: 2, state: 'available', price: 12 },
    { id: 'A3', row: 'A', number: 3, state: 'booked', price: 12 },
    { id: 'B1', row: 'B', number: 1, state: 'available', price: 15 },
  ];

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useSeatSelection());
    expect(result.current.selectedSeats).toEqual([]);
  });

  it('should toggle seat selection', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat('A1', true);
    });

    expect(result.current.selectedSeats).toEqual(['A1']);

    act(() => {
      result.current.toggleSeat('A1', true);
    });

    expect(result.current.selectedSeats).toEqual([]);
  });

  it('should not select unavailable seats', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat('A3', false);
    });

    expect(result.current.selectedSeats).toEqual([]);
  });

  it('should respect max seats limit', () => {
    const { result } = renderHook(() => useSeatSelection(2));

    act(() => {
      result.current.toggleSeat('A1', true);
      result.current.toggleSeat('A2', true);
      result.current.toggleSeat('B1', true); // Should not be added
    });

    expect(result.current.selectedSeats).toHaveLength(2);
    expect(result.current.selectedSeats).toEqual(['A1', 'A2']);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat('A1', true);
      result.current.toggleSeat('B1', true);
    });

    const total = result.current.calculateTotal(mockSeats);
    expect(total).toBe(27); // 12 + 15
  });

  it('should clear selection', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat('A1', true);
      result.current.toggleSeat('A2', true);
    });

    expect(result.current.selectedSeats).toHaveLength(2);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedSeats).toEqual([]);
  });

  it('should handle partial lock failure scenario', () => {
    const { result } = renderHook(() => useSeatSelection());

    act(() => {
      result.current.toggleSeat('A1', true);
      result.current.toggleSeat('A2', true);
      result.current.toggleSeat('B1', true);
    });

    expect(result.current.selectedSeats).toEqual(['A1', 'A2', 'B1']);

    const failedSeats = ['A2'];
    act(() => {
      const newSelection = result.current.selectedSeats.filter(
        id => !failedSeats.includes(id)
      );
      result.current.clearSelection();
      newSelection.forEach(id => result.current.toggleSeat(id, true));
    });

    expect(result.current.selectedSeats).toEqual(['A1', 'B1']);
  });
});
