import { cookies } from "next/headers";
import CompletedTripsList from "@/components/completedTripsList";

interface Trip {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  story: {
    visitedLocations: any[];
    updatedAt: string;
    contributors: any[];
  };
  owner: string;
  collaborators: any[];
  createdOn: string;
  itinerary: any[];
  tasks: any[];
  expenses: any[];
  chatMessages: any[];
  __v: number;
  pendingInvites: any[];
}

async function getCompletedTrips(): Promise<Trip[]> {
  const cookieStore = cookies();
  try {
    const res = await fetch("http://localhost:8000/api/user/completed-trips", {
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ['completed-trips'] },
    });

    if (!res.ok) throw new Error('Failed to fetch trips');
    
    const data = await res.json();
    return data.data.completedTrips || [];
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}



export default async function CompletedTripsPage() {
  const trips = await getCompletedTrips();
    const serializedTrips = trips.map(trip => ({
    ...trip,
    startDate: new Date(trip.startDate).toISOString(),
    endDate: new Date(trip.endDate).toISOString()
  }));
  return <CompletedTripsList trips={serializedTrips} />;
}