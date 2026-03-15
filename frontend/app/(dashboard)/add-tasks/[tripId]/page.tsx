import AddTask from "@/components/add-tripTasks";
import { getTripCollaborators } from "@/lib/api";

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

export default async function AddTaskServer({ params }: AddTaskProps) {
  const { tripId } = params;
  const collaborators: Collaborator[] = await getTripCollaborators(tripId);
  
  return (
    <AddTask 
      tripId={tripId}
      users={collaborators}
    />
  );
}