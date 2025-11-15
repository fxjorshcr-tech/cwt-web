// src/components/summary/IncludedFeatures.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function IncludedFeatures() {
  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-cyan-900">What&apos;s Included?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">🚐</span>
          <span className="text-gray-700">Spacious Van with Full A/C</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">👥</span>
          <span className="text-gray-700">Personalized Meet & Greet at airport</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">🚪</span>
          <span className="text-gray-700">Door-to-Door Private Service</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">📶</span>
          <span className="text-gray-700">Free Onboard Wi-Fi & Bottled Water</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">👨‍✈️</span>
          <span className="text-gray-700">Professional, Bilingual Driver</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-cyan-600 mt-0.5">💎</span>
          <span className="text-gray-700">All-Inclusive Rates, No Hidden Fees</span>
        </div>
      </CardContent>
    </Card>
  );
}
