import { cookies } from 'next/headers';
import EditActivityClient from '@/components/edit-add-trip-itinerary';

interface EditActivityPageProps {
  params: {
    tripId: string;
    itineraryId: string; 
  };
  searchParams: {
    activity?: string;
  };
}

async function getActivityData(tripId: string, activityId: string, itineraryId: string) {
  const cookieStore = await cookies();
  const res = await fetch(
    `http://localhost:8000/api/trips/${tripId}/itinerary/${itineraryId}/activities/${activityId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ['itinerary'] },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  console.log(data.activity);
  return data;
}

export default async function EditActivityPage({
  params,
  searchParams
}: EditActivityPageProps) {
  
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  console.log(resolvedSearchParams.activity);
  const activityData = resolvedSearchParams.activity
    ? await getActivityData(resolvedParams.tripId, resolvedSearchParams.activity, resolvedParams.itineraryId)
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
