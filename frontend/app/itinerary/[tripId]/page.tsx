export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Clock, Calendar, NotebookText, Plus } from "lucide-react";
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
        <Button asChild>
          <Link href={`/itinerary/${tripId}/edit`}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Activity
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {itinerary.map((day) => (
          <div key={day.date} className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">
                {formatDate(day.date)}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {day.activities.map((activity) => (
                <div 
                  key={activity.activityId} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            {activity.time}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-primary"
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
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{activity.location}</p>
                      </div>

                      {activity.notes && (
                        <div className="flex items-start gap-2">
                          <NotebookText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Notes</p>
                            <p className="text-sm text-gray-700">{activity.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
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