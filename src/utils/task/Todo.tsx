import React, { useState } from "react";
import TaskDialog from "../TaskDialog";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignedTo: {
    name: string;
    email: string;
    id: string;
  };
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
  assignedBy?: string; // optional, since you used it in JSX
};

type InProgressProps = {
  tasks: Task[];
  onStatusChange: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
};

const InProgress: React.FC<InProgressProps> = ({ tasks, onStatusChange }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openDialog = (task: Task) => {
    setSelectedTask(task);
  };

  const closeDialog = () => {
    setSelectedTask(null);
  };

  const handleStatusChange = (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    onStatusChange(taskId, newStatus);
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-5 text-indigo-600">🚧 To Do Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks are currently in progress.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg shadow-md hover:shadow-xl transition"
              onClick={() => openDialog(task)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-800">
                  {task.title}
                </h3>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  {task.status}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-2">{task.description}</p>

              {task.assignedBy && (
                <p className="text-sm text-indigo-600 font-medium">
                  Assigned by: {task.assignedBy}
                </p>
              )}

              <p className="text-sm text-gray-600 mt-1">
                📅 Due:{" "}
                <span className="font-medium">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
      <TaskDialog
        open={!!selectedTask}
        onOpenChange={closeDialog}
        selectedTask={selectedTask}
        onStatusChange={handleStatusChange}
        onClose={closeDialog}
      />
    </div>
  );
};

export default InProgress;
