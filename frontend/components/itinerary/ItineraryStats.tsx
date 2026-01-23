"use client";

import { CalendarDays, Timer, Navigation } from "lucide-react";

interface ItineraryStatsProps {
  totalDays: number;
  totalActivities: number;
}

export function ItineraryStats({ totalDays, totalActivities }: ItineraryStatsProps) {
  const avgPerDay = Math.round(totalActivities / totalDays);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
            <p className="text-sm text-gray-600">Total Days</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Timer className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            <p className="text-sm text-gray-600">Activities Planned</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Navigation className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgPerDay}</p>
            <p className="text-sm text-gray-600">Avg per Day</p>
          </div>
        </div>
      </div>
    </div>
  );
}