// types/index.ts
export type Priority = "High" | "Medium" | "Low";
export type Status = "Open" | "In Progress" | "Done";

export interface WorkOrder {
  id: string; // workOrderId
  title: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  category: string;
  assignedTo: string;
  location: string;
  cost: string;
  isOverdue: boolean;
}