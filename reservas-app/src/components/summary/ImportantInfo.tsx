// src/components/summary/ImportantInfo.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ImportantInfo() {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-gray-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-gray-900">Important Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-blue-600 mt-0.5">🧳</span>
          <span className="text-gray-700">1 large bag + 1 carry-on per person.</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-orange-600 mt-0.5">⏱️</span>
          <span className="text-gray-700">One complimentary 1-hour stop included.</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-green-600 mt-0.5">👶</span>
          <span className="text-gray-700">Baby car seats & boosters included free of charge.</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-red-600 mt-0.5">🚫</span>
          <span className="text-gray-700">
            No refund for cancellations within 48 hours of pickup.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
