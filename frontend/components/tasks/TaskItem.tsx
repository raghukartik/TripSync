"use client";
import { CheckCircle2, Circle, Edit3, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
interface AssignedTo {
  _id: string;
  name: string;
}

interface Task {
  taskId: string;
  text: string;
  assignedTo: AssignedTo;
  completed: boolean;
  _id: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete}: TaskItemProps) {
  const router = useRouter();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-5">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`flex-shrink-0 mt-0.5 transition-colors ${
            task.completed
              ? "text-green-600 hover:text-green-700"
              : "text-gray-400 hover:text-gray-600"
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium leading-6 ${
                task.completed 
                  ? "line-through text-gray-500" 
                  : "text-gray-900"
              }`}>
                {task.text}
              </h3>
              
              <div className="flex items-center gap-4 mt-3">
                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">
                      {getInitials(task.assignedTo.name)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {task.assignedTo.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={() => router.push(`/edit-tasks/${task.taskId}`)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Edit task: ${task.text}`}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}