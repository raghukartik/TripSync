"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";

interface ItineraryHeaderProps {
  tripId: string;
  totalDays: number;
  totalActivities: number;
}

export function ItineraryHeader({ tripId, totalDays, totalActivities }: ItineraryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Itinerary</h1>
          <p className="text-gray-600 mt-1">
            {totalDays} {totalDays === 1 ? 'day' : 'days'} • {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'} planned
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link href={`/itinerary/${tripId}/add`}>
            <Plus className="h-4 w-4 mr-2" />
            New Itinerary Day
          </Link>
        </Button>
      </div>
    </div>
  );
}