export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { ItineraryClient } from "@/components/itinerary/ItineraryClient";


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
  searchParams: { isCompleted?: string }
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

export default async function ItineraryPage({ params, searchParams }: ItineraryPageProps) {
  const { tripId } = params;
  const isCompleted = searchParams.isCompleted === "true";

  if (!tripId) {
    throw new Error("Trip ID is missing in params.");
  }

  const itinerary = await fetchItinerary(tripId);

  return <ItineraryClient itinerary={itinerary} tripId={tripId} isCompleted={isCompleted}/>;
}