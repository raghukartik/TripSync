import { cookies } from "next/headers";
import CompletedTripsList from "@/components/completedTripsList";
import { Trip } from "@/components/upcoming-trips";

async function getCompletedTrips(): Promise<Trip[]> {
  const cookieStore = cookies();
  try {
    const res = await fetch("http://localhost:8000/api/user/completed-trips", {
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ["completed-trips"] },
    });

    if (!res.ok) throw new Error("Failed to fetch trips");

    const data = await res.json();
    const completedTrips = data.data?.completedTrips || [];

    // Sanitize data to prevent runtime errors from missing array properties
    return completedTrips.map((trip: Trip) => ({
      ...trip,
      destinations: trip.destinations || [],
      tasks: trip.tasks || [],
      collaborators: trip.collaborators || [],
      expenses: trip.expenses || [],
      itinerary: trip.itinerary || [],
      chatMessages: trip.chatMessages || [],
      pendingInvites: trip.pendingInvites || [],
    }));
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

export default async function CompletedTripsPage() {
  const trips = await getCompletedTrips();
  const serializedTrips = trips.map((trip) => ({
    ...trip,
    startDate: new Date(trip.startDate).toISOString(),
    endDate: new Date(trip.endDate).toISOString(),
  }));
  return <CompletedTripsList trips={serializedTrips} />;
}
