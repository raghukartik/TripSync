import AddTripItinerary from "@/components/add-tripItinerary";

interface ItineraryAddPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripPage({ params }: ItineraryAddPageProps) {
  const { tripId } = await params;
  return <AddTripItinerary tripId={tripId} />;
}
