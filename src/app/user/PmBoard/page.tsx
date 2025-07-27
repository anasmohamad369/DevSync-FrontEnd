'use client';
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "@/lib/httpCilent";
import TaskDialog from "@/utils/TaskDialog";

type User = {
  _id: string;
  name: string;
};

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

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/api/tasks");
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };
    const openDialog = (task: Task) => {
    setSelectedTask(task);
  };
   const closeDialog = () => {
    setSelectedTask(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 

  const handleCreate = async () => {
    try {
      await api.post("/api/tasks", formData);
      fetchTasks();
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "todo",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "text-xs px-2 py-1 rounded-full font-medium";
    switch (status) {
      case "todo":
        return <span className={`${base} bg-gray-100 text-gray-800`}>To Do</span>;
      case "in-progress":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>In Progress</span>;
      case "done":
        return <span className={`${base} bg-green-100 text-green-700`}>Done</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">📋 Task Manager</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              + Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">New Task</h2>
            <Input
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
            <Select
              onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}
              value={formData.assignedTo}
            >
              <SelectTrigger>
                {formData.assignedTo
                  ? users.find((u) => u._id === formData.assignedTo)?.name
                  : "Assign To"}
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Create
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
       <div
  key={task._id}
  className="bg-white border border-gray-200 rounded-xl p-5 shadow transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 cursor-grab"
  onClick={() => openDialog(task)}
>

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-indigo-800">{task.title}</h3>
              {getStatusBadge(task.status)}
            </div>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            <p className="text-sm">
              👤 Assigned to:{" "}
              <span className="font-medium text-gray-800">
                {task.assignedTo?.name || "Unassigned"}
              </span>
            </p>
            <p className="text-sm mt-1">
              📅 Due:{" "}
              <span className="font-medium text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        ))}
      </div>
         <TaskDialog
        open={!!selectedTask}
        onOpenChange={closeDialog}
        selectedTask={selectedTask}
        // onStatusChange={handleStatusChange}
        onClose={closeDialog}
      />

      
    </div>
  );
};

export default TaskPage;
