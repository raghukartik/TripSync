import { EditTaskPage } from "@/components/tasks/EditTaskPage";
import { getTripTasks } from "@/lib/api";
import { Tasks, AssignedTo } from "@/components/tasks/TasksList";

interface EditProps {
  params: Promise<{
    tripId: string;
    taskId: string;
  }>;
}

const EditTask = async ({ params }: EditProps) => {
  const awaitedParams = await params;
  const { tripId, taskId } = awaitedParams;

  let response;
  try {
    response = await getTripTasks(tripId);
  } catch (error) {
    console.error(error);
    return null;
  }
  console.log(response);
  const task = response.find((t: Tasks) => t.taskId === taskId);
  if (!task) return null;

  const availableAssignees = response
    .map((t: Tasks) => t.assignedTo)
    .filter(
      (v: AssignedTo, i: number, arr: AssignedTo[]) =>
        arr.findIndex((x) => x._id === v._id) === i,
    );

  return (
    <EditTaskPage
      tasks={task}
      availableAssignees={availableAssignees}
      tripId={tripId}
    />
  );
};

export default EditTask;
