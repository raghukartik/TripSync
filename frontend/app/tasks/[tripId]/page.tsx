import { TasksList } from "@/components/tasks/TasksList";
import { getTripTasks } from "@/lib/api";

interface TasksProps{
    params: {
        tripId: string;
    }
}

export default async function TaskPage({params}: TasksProps) {
    const awaitedParams = await params;
    const tasks = await getTripTasks(awaitedParams.tripId);
    return(
        <TasksList tasks={tasks} tripId={awaitedParams.tripId}/>
    )
}