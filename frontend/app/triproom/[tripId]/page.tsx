// app/dashboard/trip-chat/page.tsx
import TripRoom from "@/components/tripRoom/trip-room";
import { getUserInfo } from "@/lib/api";
import { cookies } from "next/headers";
import { getRoomCollab } from "@/lib/api";

interface TripRoomPageProps {
  params: {
    tripId: string;
  };
}

interface Sender {
  _id: string;
  name: string;
  email: string;
}

interface MessagesHistory {
  sender: Sender;
  text: string;
  timestamp: Date;
  createdAt: Date;
}

async function getMessHistory(
  tripId: string
): Promise<MessagesHistory[] | null> {
  const cookieStore = await cookies();
  const res = await fetch(
    `http://localhost:8000/api/trips/tripRooms/${tripId}/messages`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ["messages"] },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.messages;
}

export default async function TripChat({ params }: TripRoomPageProps) {
  const userInfo = await getUserInfo();
  let userId;
  if (userInfo) {
    userId = userInfo._id;
  }
  const awaitedParams = await params;
  const messages = await getMessHistory(awaitedParams.tripId);
  const collab = await getRoomCollab(awaitedParams.tripId);
  return (
    <div className="p-4">
      <TripRoom
        tripId={awaitedParams.tripId}
        userId={userId}
        chatMessage={messages || []}
        roomCollab={collab || []}
      />
    </div>
  );
}
