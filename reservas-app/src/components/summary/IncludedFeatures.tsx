// src/components/summary/IncludedFeatures.tsx

export function IncludedFeatures() {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-cyan-900 mb-3">What&apos;s Included?</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">🚐</span>
          <span className="text-gray-700">Spacious Van with Full A/C</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">👥</span>
          <span className="text-gray-700">Personalized Meet & Greet</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">🚪</span>
          <span className="text-gray-700">Door-to-Door Private Service</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">📶</span>
          <span className="text-gray-700">Free Wi-Fi & Bottled Water</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">👨‍✈️</span>
          <span className="text-gray-700">Professional Bilingual Driver</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-cyan-600 mt-0.5">💎</span>
          <span className="text-gray-700">All-Inclusive, No Hidden Fees</span>
        </div>
      </div>
    </div>
  );
}
