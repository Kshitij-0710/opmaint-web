import { DataTable } from "@/components/ui/data-table";
import { columns } from "./collumns";
import { WorkOrder } from "@/types";
import { 
  Plus, 
  Download, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from "lucide-react";

// Mock Data
const data: WorkOrder[] = [
  { id: "WO-2024-001", title: "HVAC Unit 4 Maintenance", priority: "High", status: "In Progress", dueDate: "2024-10-24", category: "Mechanical", assignedTo: "Mike R.", location: "Building A - Roof", cost: "$1,200.00", isOverdue: true },
  { id: "WO-2024-002", title: "Lobby Light Replacement", priority: "Low", status: "Open", dueDate: "2024-11-01", category: "Electrical", assignedTo: "Unassigned", location: "Main Lobby", cost: "$150.00", isOverdue: false },
  { id: "WO-2024-003", title: "Safety Inspection: Fire Exits", priority: "High", status: "Done", dueDate: "2024-10-20", category: "Safety", assignedTo: "Sarah J.", location: "All Floors", cost: "$0.00", isOverdue: false },
  { id: "WO-2024-004", title: "Plumbing Leak - 2nd Floor", priority: "Low", status: "Open", dueDate: "2024-10-25", category: "Plumbing", assignedTo: "Dave B.", location: "Restroom 2B", cost: "$450.00", isOverdue: true },
  { id: "WO-2024-005", title: "Quarterly Generator Test", priority: "Medium", status: "Open", dueDate: "2024-11-15", category: "Mechanical", assignedTo: "Mike R.", location: "Basement", cost: "$300.00", isOverdue: false },
];

// Reusable Stat Card Component
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-lg border border-sageGreen/10 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-sageGreen uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-deepTeal mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-full ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default function WorkOrdersPage() {
  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto w-full">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {/* Breadcrumb-ish label */}
          
          <h1 className="text-3xl font-bold tracking-tight text-deepTeal">Work Orders</h1>
          <p className="text-sageGreen mt-1 text-sm">
            Manage, prioritize, and track maintenance tasks across all facilities.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-sageGreen/20 rounded-md text-sageGreen text-sm font-medium hover:bg-sageGreen/5 hover:text-deepTeal transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-sageGreen/20 rounded-md text-sageGreen text-sm font-medium hover:bg-sageGreen/5 hover:text-deepTeal transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 bg-deepTeal text-white px-4 py-2 rounded-md hover:bg-[#2A4545] transition-colors text-sm font-medium shadow-md">
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* --- STATS SUMMARY (The "High End" Touch) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Critical Issues" 
          value="2" 
          icon={AlertTriangle} 
          color="bg-red-50 text-red-600"
        />
        <StatCard 
          label="Open Orders" 
          value="12" 
          icon={Clock} 
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          label="Completed (This Week)" 
          value="24" 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600"
        />
      </div>
      
      {/* --- TABLE AREA --- */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}