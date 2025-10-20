export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Edit,
  MapPin,
  Clock,
  NotebookText,
  Plus,
  ChevronLeft,
  MoreVertical,
  Share2,
  Download,
  CalendarDays,
  Timer,
  Navigation,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

interface Activity {
  activityId: string;
  time: string;
  title: string;
  location: string;
  notes: string;
}

interface ItineraryDay {
  date: string;
  activities: Activity[];
  _id: string;
}

interface ItineraryPageProps {
  params: {
    tripId: string;
  };
}

async function fetchItinerary(tripId: string): Promise<ItineraryDay[]> {
  const cookieStore = await cookies();

  const res = await fetch(
    `http://localhost:8000/api/trips/${tripId}/itinerary`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ["itinerary"] },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `Failed to fetch itinerary. Status: ${res.status}. Body: ${errorText}`
    );
    if (res.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch itinerary");
  }

  const json = await res.json();
  console.log(json.data);
  return json.data || [];
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { tripId } = params;

  if (!tripId) {
    throw new Error("Trip ID is missing in params.");
  }

  const itinerary = await fetchItinerary(tripId);

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

  const totalActivities = itinerary.reduce((total, day) => total + day.activities.length, 0);
  const totalDays = itinerary.length;
  const startDate = itinerary.length > 0 ? itinerary[0].date : '';

  if (itinerary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link href="/dashboard">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trip Itinerary</h1>
                <p className="text-gray-600 mt-1">Plan your perfect adventure</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href={`/itinerary/${tripId}/edit/}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activities
                </Link>
              </Button>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-lg">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-12 w-12 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Your adventure awaits
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Create your perfect itinerary by adding activities, places to visit, and experiences to remember. 
                Build your day-by-day plan and never miss a moment.
              </p>
              
              <div className="space-y-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href={`/itinerary/${tripId}/add`}>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Itinerary
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Schedule activities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Add locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NotebookText className="h-4 w-4" />
                    <span>Include notes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href={`/itinerary/${tripId}/add`}>
                <Plus className="h-4 w-4 mr-2" />
                New Itinerary Day
              </Link>
            </Button>
          </div>
        </div>

        {/* Trip Overview Stats */}
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
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalActivities / totalDays)}</p>
                <p className="text-sm text-gray-600">Avg per Day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {itinerary.map((day, dayIndex) => (
            <div key={day.date} className="relative">
              {/* Timeline connector */}
              {dayIndex < itinerary.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-blue-200 to-purple-200 z-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Day Header */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {getDayNumber(day.date, startDate)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formatDate(day.date)}
                      </h2>
                      <p className="text-gray-600">
                        {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    Day {getDayNumber(day.date, startDate)}
                  </Badge>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href={`/itinerary/${tripId}/edit/${day._id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Link>
                  </Button>
                </div>

                {/* Activities */}
                <div className="ml-20 space-y-4">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activity.activityId} className="group relative">
                      {/* Activity connector */}
                      {activityIndex < day.activities.length - 1 && (
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
                                    pathname: `/itinerary/${tripId}/edit/${day._id}`,
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Activities CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add more to your itinerary
                </h3>
                <p className="text-gray-600 mb-4">
                  Keep building your perfect trip with more activities and experiences
                </p>
              </div>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href={`/itinerary/${tripId}/add`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Itinerary Day
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}