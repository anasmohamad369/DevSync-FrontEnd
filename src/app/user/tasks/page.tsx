"use client";
import CompletedTasks from "@/utils/task/Completed";
import InProgress from "@/utils/task/InProgress";
import ToDo from "@/utils/task/Todo";
import api from "@/lib/httpCilent";
import React, { useEffect } from "react";

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
const Page = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await api.get("/api/tasks/my-tasks");
    setTasks(res.data);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const todo = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "done");

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No tasks available</p>
        <p> wait until some one assign</p>
      </div>
    );
  }
  const updateTaskStatus = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
      const updatedTask = res.data;

      // Update local state with the new task status
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-black">
          <div className="">
            <InProgress
              tasks={inProgressTasks}
              onStatusChange={updateTaskStatus}
            />
          </div>

          <div className="">
            <ToDo tasks={todo} onStatusChange={updateTaskStatus} />
          </div>

          <div className="">
            <CompletedTasks
              tasks={completedTasks}
              onStatusChange={updateTaskStatus}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
