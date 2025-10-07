import { Badge } from '@/components/ui/badge';

export function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center p-4 bg-card rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary rounded-md" />
        <span className="text-sm">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-muted rounded-md" />
        <span className="text-sm">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-secondary rounded-md opacity-50" />
        <span className="text-sm">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-chart-5 rounded-md opacity-70" />
        <span className="text-sm">Locked</span>
      </div>
    </div>
  );
}
