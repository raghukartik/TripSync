import CompletedTripsList from "@/components/completedTripsList";
import { Trip } from "@/components/upcoming-trips";
import { getCompletedTrips } from "@/lib/api";

export default async function CompletedTripsPage() {
  const trips: Trip[] = await getCompletedTrips();
  return <CompletedTripsList trips={trips} />;
}
