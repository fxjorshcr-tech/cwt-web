'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function LaunchBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('launch-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('launch-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500 text-white py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-sm sm:text-base">
        <span className="inline-block">⚠️</span>
        <p>
          <strong>Website Testing in Progress</strong> — Online payments coming soon!
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
