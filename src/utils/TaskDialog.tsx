"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { useEffect, useState } from "react"

type Task = {
  _id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  assignedTo: {
    name: string
    email: string
    id: string
  }
  dueDate: string
  createdAt: string
  updatedAt?: string
  assignedBy?: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTask: Task | null
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void
  onClose: () => void
}

const TaskDialog: React.FC<Props> = ({ open, onOpenChange, selectedTask, onStatusChange, onClose }) => {
  const [status, setStatus] = useState<Task["status"]>("todo")

  useEffect(() => {
    if (selectedTask) {
      setStatus(selectedTask.status)
    }
  }, [selectedTask])

  const handleSave = () => {
    if (selectedTask && onStatusChange) {
      onStatusChange(selectedTask._id, status)
    }
    onClose()
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!selectedTask) return null
  console.log(selectedTask)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold leading-tight pr-4">{selectedTask.title}</DialogTitle>
            <Badge variant="outline" className={`${getStatusColor(selectedTask.status)} font-medium`}>
              {selectedTask.status === "in-progress"
                ? "In Progress"
                : selectedTask.status === "todo"
                  ? "To Do"
                  : "Done"}
            </Badge>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">Task Details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedTask.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Assigned to:</span>
                <span className="font-medium">{selectedTask.assignedTo.name}</span>
              </div>

              {/* {selectedTask.assignedBy && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Assigned by:</span>
                  <span className="font-medium">{selectedTask.assignedBy}</span>
                </div>
              )} */}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Due date:</span>
                <span className="font-medium">{formatDate(selectedTask.dueDate)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(selectedTask.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Update Status</h3>
              <Select value={status} onValueChange={(val) => setStatus(val as Task["status"])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={status === selectedTask.status}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDialog
