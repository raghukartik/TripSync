"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Map, Users, FolderOpen, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Optional

type Collaborator = {
  _id: string;
  name?: string;
};

type Trip = {
  title?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  collaborators?: Collaborator[];
  // Add other fields as needed
};

export default function TripRoom() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetch
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Replace with actual fetch to your backend API
        const res = await fetch(`/api/trips/${tripId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setTrip(data);
      } catch (error) {
        console.error("Failed to fetch trip", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Trip Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{trip?.title || "Trip Title"}</h1>
          <p className="text-muted-foreground">
            {trip?.location || "Destination Name"} •{" "}
            <span>
              {trip?.startDate || "Start Date"} – {trip?.endDate || "End Date"}
            </span>
          </p>
        </div>
        {/* Placeholder for Trip Actions */}
        <div className="mt-4 md:mt-0 flex gap-2">
          {/* Add buttons for edit, share, delete, etc. */}
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Itinerary / Map */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Itinerary</h2>
          </div>
          <div>
            {/* Placeholder for places/plan/map */}
            <p className="text-muted-foreground">[Trip plan or interactive map here]</p>
          </div>
        </div>

        {/* Collaborators */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Collaborators</h2>
          </div>
          <div className="space-y-2">
            {/* Placeholder for user avatars */}
            {trip?.collaborators?.map((user: Collaborator) => (
              <div key={user._id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <span>{user.name || "Collaborator Name"}</span>
              </div>
            )) || <p>No collaborators yet.</p>}
          </div>
        </div>

        {/* Shared Resources */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Resources</h2>
          </div>
          <div>
            {/* Placeholder for files, notes, lists */}
            <p className="text-muted-foreground">[Packing lists, files, etc.]</p>
          </div>
        </div>

        {/* Group Chat */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow col-span-1 xl:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Trip Chat</h2>
          </div>
          <div className="h-60 overflow-y-auto rounded-md border p-2 text-sm">
            {/* Placeholder for chat messages */}
            <p className="text-muted-foreground">[Live chat feature]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
