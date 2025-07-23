// app/dashboard/trip-chat/page.tsx
import TripRoom from "@/components/trip-room";
export default function TripChat() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trip Chat</h1>
      <p>Select a trip to view and chat with your group.</p>
      <TripRoom/>
    </div>
  );
}
