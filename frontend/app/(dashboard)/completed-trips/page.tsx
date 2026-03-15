import CompletedTripsList from "@/components/completedTripsList";
import { Trip } from "@/components/upcoming-trips";
import { getCompletedTrips } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CompletedTripsPage() {
  try {
    const trips: Trip[] = (await getCompletedTrips()) ?? [];
    return <CompletedTripsList trips={trips} />;
  } catch (error) {
    console.error("Error fetching completed trips:", error);
    return <CompletedTripsList trips={[]} />;
  }
}
