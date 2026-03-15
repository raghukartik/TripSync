export const dynamic = "force-dynamic";
import { fetchItinerary } from "@/lib/api";
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
  params: Promise<{
    tripId: string;
  }>;
  searchParams: Promise<{ isCompleted?: string }>;
}

export default async function ItineraryPage({
  params,
  searchParams,
}: ItineraryPageProps) {
  const awaitedParams = await params;
  const { tripId } = awaitedParams;
  const awaitedSearchParams = await searchParams;
  const isCompleted = awaitedSearchParams.isCompleted === "true";

  if (!tripId) {
    throw new Error("Trip ID is missing in params.");
  }

  const itinerary: ItineraryDay[] = await fetchItinerary(tripId);

  return (
    <ItineraryClient
      itinerary={itinerary}
      tripId={tripId}
      isCompleted={isCompleted}
    />
  );
}
