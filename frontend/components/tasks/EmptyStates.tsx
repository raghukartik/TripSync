"use client";
import { Plus, Filter } from "lucide-react";

interface EmptyTasksStateProps {
  onCreateTask: () => void;
  isCompleted?: boolean;
}

export function EmptyTasksState({
  onCreateTask,
  isCompleted = false,
}: EmptyTasksStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
          <Plus className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {isCompleted
            ? "No tasks were created for this trip."
            : "Get organized by creating your first task for this trip. Track progress and assign responsibilities."}
        </p>
        {!isCompleted && (
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Task
          </button>
        )}
      </div>
    </div>
  );
}

export function NoMatchingTasksState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <Filter className="h-8 w-8 text-gray-400 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No matching tasks
      </h3>
      <p className="text-gray-500">
        Try adjusting your search or filter criteria to find what you&#39;re
        looking for.
      </p>
    </div>
  );
}
