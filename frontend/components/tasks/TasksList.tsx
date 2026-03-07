"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TasksListHeader } from "./TasksListHeader";
import { TasksFilters } from "./TasksFilters";
import { TaskItem } from "./TaskItem";
import { EmptyTasksState, NoMatchingTasksState } from "./EmptyStates";

export interface AssignedTo {
  _id: string;
  name: string;
}

interface Status {
  status: string;
}

export interface Tasks {
  taskId: string;
  text: string;
  assignedTo: AssignedTo;
  completed: boolean;
  _id: string;
}

interface TasksListProps {
  tasks: Tasks[] | null;
  tripId: string;
  availableAssignees?: AssignedTo[];
  isCompleted: boolean;
}

export function TasksList({ tasks, tripId, isCompleted }: TasksListProps) {
  const [localTasks, setLocalTasks] = useState<Tasks[]>(tasks || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status>({ status: "all" });
  const router = useRouter();

  const handleToggleComplete = useCallback((taskId: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const handleAddTask = useCallback(() => {
    router.push(`/add-tasks/${tripId}`);
  }, [router, tripId]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterStatus({ status: "all" });
  }, []);

  const filteredTasks = localTasks.filter((task) => {
    const matchesSearch =
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus.status === "all" ||
      (filterStatus.status === "completed" && task.completed) ||
      (filterStatus.status === "pending" && !task.completed);

    return matchesSearch && matchesStatus;
  });

  const completedCount = localTasks.filter((task) => task.completed).length;
  const totalCount = localTasks.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!localTasks || localTasks.length === 0) {
    return (
      <EmptyTasksState onCreateTask={handleAddTask} isCompleted={isCompleted} />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <TasksListHeader
          completedCount={completedCount}
          totalCount={totalCount}
          completionPercentage={completionPercentage}
          onAddTask={handleAddTask}
          isCompleted={isCompleted}
        />

        <TasksFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filteredCount={filteredTasks.length}
          totalCount={totalCount}
          onClearFilters={handleClearFilters}
        />

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task._id}>
              <TaskItem
                task={task}
                tripId={tripId}
                onToggleComplete={handleToggleComplete}
                isCompleted={isCompleted}
              />
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && localTasks.length > 0 && (
          <NoMatchingTasksState />
        )}
      </div>
    </>
  );
}
