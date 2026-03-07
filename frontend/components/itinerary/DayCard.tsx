"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ActivityCard } from "./ActivityCard";
import type { ItineraryDay } from "./ItineraryClient";
import { useRouter } from "next/navigation";

interface DayCardProps {
  day: ItineraryDay;
  dayIndex: number;
  startDate: string;
  tripId: string;
  itineraryId: string;
  isCompleted?: boolean;
}

export function DayCard({ day, startDate, tripId, itineraryId, isCompleted }: DayCardProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayNumber = (dateString: string, startDate: string) => {
    const current = new Date(dateString);
    const start = new Date(startDate);
    const diffTime = Math.abs(current.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleDeleteItinerary = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8000/api/trips/${tripId}/itinerary/${itineraryId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (res.ok) {
      router.refresh();
    }else{
      const data = await res.json();
      console.error(data.message);
    }
  };

  const dayNumber = getDayNumber(day.date, startDate);

  return (
    <div className="relative z-10">
      {/* Day Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {dayNumber}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {formatDate(day.date)}
            </h2>
            <p className="text-gray-600">
              {day.activities.length}{" "}
              {day.activities.length === 1 ? "activity" : "activities"} planned
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          Day {dayNumber}
        </Badge>
        {!isCompleted && (
          <>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href={`/itinerary/${tripId}/edit/${day._id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              onClick={handleDeleteItinerary}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Day
            </Button>
          </>
        )}
      </div>

      {/* Activities */}
      <div className="ml-20 space-y-4">
        {day.activities.map((activity, activityIndex) => (
          <ActivityCard
            key={activity.activityId}
            activity={activity}
            activityIndex={activityIndex}
            isLastActivity={activityIndex === day.activities.length - 1}
            tripId={tripId}
            dayId={day._id}
            isCompleted={isCompleted}
          />
        ))}
      </div>
    </div>
  );
}
