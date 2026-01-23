"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, StickyNote, MoreVertical, Edit } from "lucide-react";
import Link from "next/link";
import type { Activity } from "./ItineraryClient";

interface ActivityCardProps {
  activity: Activity;
  activityIndex: number;
  isLastActivity: boolean;
  tripId: string;
  dayId: string;
}

export function ActivityCard({ 
  activity, 
  isLastActivity, 
  tripId, 
  dayId 
}: ActivityCardProps) {
  return (
    <div className="group relative">
      {/* Activity connector */}
      {!isLastActivity && (
        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
      )}
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Activity Header */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs bg-white">
                    {activity.time}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {activity.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Link
                  href={{
                    pathname: `/itinerary/${tripId}/edit/${dayId}`,
                    query: {
                      activity: activity.activityId,
                    },
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Activity Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                <p className="text-gray-900 leading-relaxed">
                  {activity.location}
                </p>
              </div>
            </div>

            {/* Notes */}
            {activity.notes && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <StickyNote className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                  <p className="text-gray-900 leading-relaxed">
                    {activity.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}