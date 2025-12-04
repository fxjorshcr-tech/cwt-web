// src/components/sections/SeasonalBanner.tsx
// Dynamic seasonal messaging banner based on current date
'use client';

import { Sun, Leaf, Snowflake, Calendar } from 'lucide-react';

// Get current season and messaging based on Costa Rica travel patterns
function getSeasonalInfo(): {
  type: 'high' | 'green' | 'shoulder';
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
  icon: typeof Sun;
} {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // High Season: December 15 - April 15
  if (
    (month === 11 && day >= 15) || // Dec 15-31
    month === 0 || // January
    month === 1 || // February
    month === 2 || // March
    (month === 3 && day <= 15) // April 1-15
  ) {
    return {
      type: 'high',
      title: 'High Season',
      message: 'Peak travel season - book early for best availability',
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      textColor: 'text-white',
      icon: Sun,
    };
  }

  // Green Season: May - November
  if (month >= 4 && month <= 10) {
    return {
      type: 'green',
      title: 'Green Season',
      message: 'Lush landscapes & fewer crowds - great time to visit!',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-white',
      icon: Leaf,
    };
  }

  // Shoulder Season: April 16-30, November 15-December 14
  return {
    type: 'shoulder',
    title: 'Shoulder Season',
    message: 'Perfect balance of weather and availability',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    textColor: 'text-white',
    icon: Calendar,
  };
}

// Check if it's holiday period (Christmas, New Year)
function isHolidayPeriod(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Christmas week (Dec 20 - Jan 2)
  return (month === 11 && day >= 20) || (month === 0 && day <= 2);
}

export default function SeasonalBanner() {
  const seasonal = getSeasonalInfo();
  const isHoliday = isHolidayPeriod();
  const Icon = seasonal.icon;

  return (
    <div className={`${seasonal.bgColor} ${seasonal.textColor}`}>
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold">{seasonal.title}:</span>
          <span className="opacity-95">
            {isHoliday
              ? 'Holiday dates filling fast - secure your transfer now!'
              : seasonal.message}
          </span>
        </div>
      </div>
    </div>
  );
}
