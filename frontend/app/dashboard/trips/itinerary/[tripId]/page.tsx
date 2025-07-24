export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, MapPin, Clock } from "lucide-react";
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
}

interface ItineraryPageProps {
  params: {
    tripId: string;
  };
}

async function fetchItinerary(tripId: string): Promise<ItineraryDay[]> {
  const cookieStore = await cookies();

  const res = await fetch(`http://localhost:8000/api/trips/${tripId}/itinerary`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
    next: { tags: ["itinerary"] },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to fetch itinerary. Status: ${res.status}. Body: ${errorText}`);
    if (res.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch itinerary");
  }

  const json = await res.json();

  return json.data || []; 
}



export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const {tripId} = await params;

  if (!tripId) {
    throw new Error("Trip ID is missing in params.");
  }

  const itinerary = await fetchItinerary(tripId);
  console.log('itinerary: ', itinerary);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (itinerary.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trip Itinerary</h1>
          <Button asChild variant="outline">
            <Link href={`/itinerary/${tripId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Add Activities
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-gray-900">No activities planned yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start by adding your first activity to create your itinerary.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href={`/itinerary/${tripId}/edit`}>Add Activity</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trip Itinerary</h1>
        <Button asChild variant="outline">
          <Link href={`/itinerary/${tripId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Itinerary
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {itinerary.map((day) => (
          <div key={day.date} className="border rounded-lg overflow-hidden">
            <div className="bg-primary px-6 py-3">
              <h2 className="text-xl font-semibold text-primary-foreground">
                {formatDate(day.date)}
              </h2>
            </div>

            <div className="divide-y">
              {day.activities.map((activity) => (
                <div key={activity.activityId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {activity.title}
                        </h3>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {activity.time}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                        {activity.location}
                      </div>
                      {activity.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-medium">Notes:</p>
                          <p>{activity.notes}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      asChild
                    >
                      <Link
                        href={{
                          pathname: `/itinerary/${tripId}/edit`,
                          query: {
                            activity: activity.activityId,
                            date: day.date,
                          },
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
