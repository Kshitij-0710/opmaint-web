"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WorkOrder } from "@/types";
import { AlertCircle, Clock } from "lucide-react";

// Updated Badge logic for High-End look
const PriorityBadge = ({ level }: { level: string }) => {
  const styles = {
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    Low: "bg-slate-50 text-slate-600 border-slate-200",
  }[level] || "bg-gray-50 text-gray-600";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase font-bold tracking-wide border ${styles}`}>
      {level}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    "Open": "bg-sky-50 text-sky-700 border-sky-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Done": "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[status] || "bg-gray-50 text-gray-600";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}>
      {status}
    </span>
  );
};

export const columns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 110,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-deepTeal">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Work Order Title",
    size: 280,
    cell: ({ row }) => (
      <span className="font-medium text-deepTeal text-sm">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 130,
    cell: ({ row }) => <PriorityBadge level={row.getValue("priority")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 130,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "assignedTo",
    header: "Assignee",
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-deepTeal text-white flex items-center justify-center text-[10px] font-bold">
           {(row.getValue("assignedTo") as string).charAt(0)}
        </div>
        <span className="text-sm">{row.getValue("assignedTo")}</span>
      </div>
    )
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    size: 140,
    cell: ({ row }) => {
      const isOverdue = row.original.isOverdue;
      return (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-red-600" : "text-sageGreen"}`}>
          {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {row.getValue("dueDate")}
        </div>
      );
    },
  },
];