// app/dashboard/trip-chat/page.tsx
import TripRoom from "@/components/trip-room";
import { getUserInfo } from "@/lib/auth";


interface TripRoomPageProps{
  params:{
    tripId: string,
  }
}

export default async function TripChat({params}: TripRoomPageProps) {
  const userInfo = await getUserInfo();
  let userId;
  if(userInfo){
    userId = userInfo._id;
  }
  const awaitedParams = await params;

  return (
    <div className="p-4">
      <TripRoom tripId={awaitedParams.tripId} userId={userId}/>
    </div>
  );
}
