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
  assignedBy?: string;
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

  console.log(selectedTask);
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
      <h2 className="text-xl font-bold mb-5 text-indigo-600">
        🚧 In Progress Tasks
      </h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks are currently in progress.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-blue-50 p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition-colors duration-200"
              onClick={() => openDialog(task)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-800">
                  {task.title}
                </h3>
                <span
                  className={`
                    text-sm font-medium px-3 py-1 rounded-full
                    ${
                      task.status === "todo"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }
                  `}
                >
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "in-progress"
                    ? "In Progress"
                    : "Done"}
                </span>
              </div>
              <p className="text-gray-700">{task.description}</p>
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
