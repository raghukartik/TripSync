import { cookies } from "next/headers";
import { TasksList } from "@/components/task-list";
interface AssignedTo{
    _id: string;
    name: string;
}
interface Tasks{
    taskId: string;
    text: string;
    assignedTo: AssignedTo;
    completed: boolean;
    _id: string;
}

interface TasksProps{
    params: {
        tripId: string;
    }
}

async function getTripTasks(tripId: string) : Promise<Tasks[] | null> {
    const cookieStore = await cookies();
    const res = await fetch(`http://localhost:8000/api/trips/${tripId}/tasks`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        next: { tags: ['tasks'] },
    })

    if(!res.ok){
        throw new Error("Error while fetching Trip's Tasks");
    }

    const data = await res.json();
    return data.data;
}

export default async function TaskPage({params}: TasksProps) {
    const awaitedParams = await params;
    const tasks = await getTripTasks(awaitedParams.tripId);
    return(
        <TasksList tasks={tasks} tripId={awaitedParams.tripId}/>
    )
}