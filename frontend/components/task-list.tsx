"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Circle, 
  Edit3, 
  User, 
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock
} from "lucide-react";

interface AssignedTo {
  _id: string;
  name: string;
}

interface Tasks {
  taskId: string;
  text: string;
  assignedTo: AssignedTo;
  completed: boolean;
  _id: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TasksListProps {
  tasks: Tasks[] | null;
  tripId: string;
}


export function TasksList({ tasks, tripId }: TasksListProps) {
  const [localTasks, setLocalTasks] = useState<Tasks[]>(tasks || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const router = useRouter();
  const handleToggleComplete = useCallback((taskId: string) => {
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, []);
 
  const handleEditClick = useCallback((taskId: string) => {
    console.log("Edit task:", taskId);
    // Will be implemented with edit modal
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const formatDueDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }, []);

  const isDueSoon = useCallback((dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }, []);

  const isOverdue = useCallback((dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  }, []);

  const filteredTasks = localTasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && task.completed) ||
                         (filterStatus === "pending" && !task.completed);
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedCount = localTasks.filter(task => task.completed).length;
  const totalCount = localTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!localTasks || localTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
            <Plus className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Get organized by creating your first task for this trip. Track progress and assign responsibilities.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Create First Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trip Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => router.push(`/add-tasks/${tripId}`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
        
        {(searchTerm || filterStatus !== "all" || filterPriority !== "all") && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {totalCount} tasks
            </span>
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterPriority("all");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
              task.completed 
                ? "border-green-200 bg-gradient-to-r from-green-50 to-transparent" 
                : isOverdue(task.dueDate)
                ? "border-red-200 bg-gradient-to-r from-red-50 to-transparent"
                : isDueSoon(task.dueDate)
                ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-transparent"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(task._id)}
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

                        {/* Priority Badge */}
                        {task.priority && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        )}

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-xs font-medium ${
                            isOverdue(task.dueDate) && !task.completed
                              ? "text-red-600"
                              : isDueSoon(task.dueDate) && !task.completed
                              ? "text-yellow-700"
                              : "text-gray-500"
                          }`}>
                            <Clock className="h-3 w-3" />
                            {formatDueDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => handleEditClick(task._id)}
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
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && localTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Filter className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching tasks</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find what you&#39;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}