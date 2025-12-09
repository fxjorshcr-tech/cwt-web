// src/components/summary/ImportantInfo.tsx

export function ImportantInfo() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-300 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Information</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs">
          <span className="text-blue-600 mt-0.5">🧳</span>
          <span className="text-gray-700">1 large bag + 1 carry-on per person</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-orange-600 mt-0.5">⏱️</span>
          <span className="text-gray-700">One complimentary 1-hour stop</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-green-600 mt-0.5">👶</span>
          <span className="text-gray-700">Baby car seats & boosters free</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-red-600 mt-0.5">🚫</span>
          <span className="text-gray-700">No refund within 48h of pickup</span>
        </div>
      </div>
    </div>
  );
}
