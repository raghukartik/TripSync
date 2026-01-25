import { EditTaskPage } from "@/components/tasks/EditTaskPage";
import { getTripTasks } from "@/lib/api";
import { Tasks, AssignedTo } from "@/components/tasks/TasksList";

interface EditProps {
  params: {
    tripId: string;
    taskId: string;
  };
}

const EditTask = async ({ params }: EditProps) => {
  const { tripId, taskId } = params;

  let response;
  try {
    response = await getTripTasks(tripId);
  } catch (error) {
    console.error(error);
    return null;
  }

  const task = response.find((t: Tasks) => t._id === taskId);
  if (!task) return null;

  const availableAssignees = response
    .map((t: Tasks) => t.assignedTo)
    .filter(
      (v: AssignedTo, i: number, arr: Tasks[]) =>
        arr.findIndex((x) => x._id === v._id) === i
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
