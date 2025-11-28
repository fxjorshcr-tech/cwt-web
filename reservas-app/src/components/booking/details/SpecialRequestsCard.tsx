// src/components/booking/details/SpecialRequestsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SpecialRequestsCardProps {
  specialRequests: string;
  onSpecialRequestsChange: (value: string) => void;
}

export function SpecialRequestsCard({
  specialRequests,
  onSpecialRequestsChange,
}: SpecialRequestsCardProps) {
  return (
    <Card className="notranslate" translate="no">
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg">Special Requests</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Any special needs? (Optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          placeholder="e.g., Need child car seat, extra luggage..."
          value={specialRequests}
          onChange={(e) => onSpecialRequestsChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </CardContent>
    </Card>
  );
}
