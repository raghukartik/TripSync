import CompletedTripsList from "@/components/completedTripsList";
import { Trip } from "@/components/upcoming-trips";
import { getCompletedTrips } from "@/lib/api";

export default async function CompletedTripsPage() {
  try {
    const trips: Trip[] = await getCompletedTrips();
    if(!trips) {
      throw new Error("No completed trips found");
    }
    return <CompletedTripsList trips={trips} />;
  } catch (error) {
    console.error("Error fetching completed trips:", error);
  }
}
