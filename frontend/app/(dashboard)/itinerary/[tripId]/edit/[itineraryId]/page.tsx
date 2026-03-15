import EditActivityClient from "@/components/edit-add-trip-itinerary";
import { getActivityData } from "@/lib/api";

interface EditActivityPageProps {
  params: Promise<{
    tripId: string;
    itineraryId: string;
  }>;
  searchParams: Promise<{
    activity?: string;
  }>;
}

export default async function EditActivityPage({
  params,
  searchParams,
}: EditActivityPageProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  console.log(resolvedSearchParams.activity);
  const activityData = resolvedSearchParams.activity
    ? await getActivityData(
        resolvedParams.tripId,
        resolvedSearchParams.activity,
        resolvedParams.itineraryId,
      )
    : null;

  console.log(activityData?.activity);
  return (
    <EditActivityClient
      tripId={resolvedParams.tripId}
      itineraryId={resolvedParams.itineraryId}
      activityId={resolvedSearchParams.activity}
      initialData={activityData?.activity}
    />
  );
}
