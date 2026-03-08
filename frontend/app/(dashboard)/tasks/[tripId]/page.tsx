import { TasksList } from "@/components/tasks/TasksList";
import { getTripTasks } from "@/lib/api";

interface TasksProps{
    params: {
        tripId: string;
    },
    searchParams: {
        isCompleted?: string
    }
}

export default async function TaskPage({params, searchParams}: TasksProps) {
    const awaitedParams = await params;
    const awaitedSearchParams = await searchParams;
    const isCompleted = awaitedSearchParams.isCompleted === "true";
    const tasks = await getTripTasks(awaitedParams.tripId);
    return(
        <TasksList tasks={tasks} tripId={awaitedParams.tripId} isCompleted={isCompleted}/>
    )
}