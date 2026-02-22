import AddTripItinerary from "@/components/add-tripItinerary";

interface ItineraryAddPageProps {
  params: {
    tripId: string;
  };
}

export default function TripPage({ params }: ItineraryAddPageProps) {
  const { tripId } = params;
  return (
    <AddTripItinerary tripId={tripId} />
  );
}