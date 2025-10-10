import { cookies } from "next/headers";
import AddTask from "@/components/add-tripTasks";



interface Collaborator {
  _id: string;
  name: string;
  email: string;
}

interface AddTaskProps {
  params: {
    tripId: string;
  };
}

export async function getTripCollaborators(tripId: string): Promise<Collaborator[]>{
  try {
    const cookieStore = await cookies();
    const res = await fetch(`http://localhost:8000/api/trips/${tripId}/collaborators`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ['trip-collaborators'] }
    })

    if(!res.ok){
      throw new Error(`Failed to fetch collaborators: ${res.statusText}`);
    }

    const data = await res.json();
    return data.collaborators || [];
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return [];
  }
}

export default async function AddTaskServer({ params }: AddTaskProps) {
  const { tripId } = params;
  const collaborators = await getTripCollaborators(tripId);
  
  return (
    <AddTask 
      tripId={tripId}
      users={collaborators}
    />
  );
}