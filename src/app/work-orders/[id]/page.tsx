"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, Calendar, MapPin, 
  CheckSquare, Wrench, DollarSign, 
  MessageSquare, Send, Paperclip, ChevronDown, 
  UserPlus, Eye, Users, Clock, Box, Layers, 
  AlignLeft, Hash, ListChecks, SlidersHorizontal,
  Plus, Archive, CheckCircle2, FileText, PlayCircle, MoreVertical, Edit, Copy, Trash2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const workOrder = {
  id: "WO-2024-001",
  title: "HVAC Unit 4 Maintenance - Quarterly Service",
  status: "In Progress", 
  priority: "High",
  description: "Perform comprehensive inspection of the HVAC unit including filter replacement, coolant level checks, and motor vibration analysis. Ensure all safety protocols are followed.",
  createdAt: "Oct 20, 2024",
  dueDate: "Oct 24, 2024",
  
  context: {
    location: "Building A",
    zone: "North Wing",
    subzone: "Roof Sector 4",
    asset: "HVAC Unit 4",
    assetId: "AST-8821"
  },

  // SMART FORM TASKS
  tasks: [
    { id: 1, type: "boolean", question: "Safety Lockout / Tagout Performed?", value: true },
    { id: 2, type: "number", question: "Record Inlet Temperature (Celsius)", value: 24.5, unit: "°C" },
    { id: 3, type: "radio", question: "Filter Condition", options: ["Good", "Fair", "Replace Immediately"], value: "Fair" },
    { id: 4, type: "range", question: "Vibration Level (1-10)", min: 1, max: 10, value: 3 },
    { id: 5, type: "text", question: "Technician Observations", value: "" },
  ],

parts: [
    { id: "P-101", name: "HEPA Air Filter (MERV 13)", sku: "FLT-200X", qty: 2, cost: 45.00, stock: "In Stock", stockLevel: "High" },
    { id: "P-102", name: "Coolant Fluid (Gallon)", sku: "CLT-500", qty: 1, cost: 30.00, stock: "Low Stock", stockLevel: "Low" },
    { id: "P-103", name: "Vibration Damper Pad", sku: "VIB-990", qty: 4, cost: 12.50, stock: "In Stock", stockLevel: "Medium" },
  ],

  // NEW: Time Logs
  timeLog: [
    { id: 1, user: "Kshitij Moghe", date: "Oct 20", duration: "2h 30m", type: "Labor", rate: 85 },
    { id: 2, user: "Rishi Banerjee", date: "Oct 20", duration: "1h 15m", type: "Inspection", rate: 95 },
    { id: 3, user: "Kshitij Moghe", date: "Oct 21", duration: "0h 45m", type: "Admin", rate: 85 },
  ],

  // NEW: Additional Expenses
  expenses: [
    { id: 1, item: "Specialized Tool Rental", category: "Equipment", cost: 150.00, status: "Approved" },
    { id: 2, item: "Waste Disposal Fee", category: "Compliance", cost: 45.00, status: "Pending" },
  ]
,
  participants: {
    assigned: [
      { name: "Kshitij Moghe", role: "Lead Technician", initials: "KM", color: "bg-deepTeal" },
      { name: "Rishi Banerjee", role: "Technical Specialist", initials: "RB", color: "bg-deepTeal" }
    ],
    monitors: [
      { name: "Santhim Nahar", role: "Facility Manager", initials: "SN", color: "bg-sageGreen" }
    ],
    team: [
      { name: "Alpha Squad", role: "Maintenance Team A", initials: "AS", color: "bg-limeGreen text-deepTeal" }
    ]
  },

  activityLog: [
    { user: "Rishi", action: "changed status to In Progress", time: "2 hours ago", type: "system" },
    { user: "Kshitij", message: "I've picked up the new filters. Heading to the roof now.", time: "1 hour ago", type: "chat" },
  ]
};

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tasks");
  const [status, setStatus] = useState(workOrder.status);
  const [showMenu, setShowMenu] = useState(false);

  // Helper: Status Colors
  const getStatusColor = (s: string) => {
    switch(s) {
      case "In Progress": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Done": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  // Helper: Context Tile Component
  const ContextTile = ({ icon: Icon, label, value, subLabel }: any) => (
    <button className="group relative flex flex-col justify-center p-5 text-left transition-all hover:bg-parchment/40 min-h-[100px] border-r border-sageGreen/10 last:border-r-0">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-limeGreen transition-colors" />
      <span className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-sageGreen group-hover:text-deepTeal transition-colors">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <div className="text-base font-bold text-deepTeal leading-tight group-hover:underline decoration-limeGreen underline-offset-4 decoration-2">
        {value}
      </div>
      {subLabel && <div className="mt-1 font-mono text-[10px] text-sageGreen">{subLabel}</div>}
    </button>
  );

  // Helper: Render Smart Inputs
  const renderFormInput = (task: any) => {
    switch (task.type) {
      case "boolean":
        return (
          <label className="flex items-center gap-3 p-4 rounded-lg border border-sageGreen/10 bg-white hover:border-limeGreen/50 cursor-pointer transition-all">
             <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.value ? "bg-limeGreen border-limeGreen text-deepTeal" : "border-sageGreen/30 bg-white"}`}>
               {task.value && <CheckSquare className="w-4 h-4" />}
             </div>
             <span className="font-medium text-deepTeal">{task.question}</span>
          </label>
        );
      case "text":
        return (
          <div className="space-y-2 p-4 rounded-lg border border-sageGreen/10 bg-white">
             <div className="flex items-center gap-2 text-sm font-bold text-deepTeal">
                <AlignLeft className="w-4 h-4 text-sageGreen" /> {task.question}
             </div>
             <textarea 
               className="w-full mt-2 p-3 bg-parchment/30 border border-sageGreen/20 rounded-md text-sm text-deepTeal focus:ring-1 focus:ring-limeGreen focus:border-limeGreen outline-none"
               rows={3}
               placeholder="Type your answer here..."
               defaultValue={task.value}
             />
          </div>
        );
      case "number":
        return (
          <div className="space-y-2 p-4 rounded-lg border border-sageGreen/10 bg-white">
             <div className="flex items-center gap-2 text-sm font-bold text-deepTeal">
                <Hash className="w-4 h-4 text-sageGreen" /> {task.question}
             </div>
             <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 className="w-32 p-2 bg-parchment/30 border border-sageGreen/20 rounded-md text-sm text-deepTeal focus:border-limeGreen outline-none font-mono font-bold"
                 defaultValue={task.value}
               />
               <span className="text-sageGreen font-medium">{task.unit}</span>
             </div>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-3 p-4 rounded-lg border border-sageGreen/10 bg-white">
             <div className="flex items-center gap-2 text-sm font-bold text-deepTeal">
                <ListChecks className="w-4 h-4 text-sageGreen" /> {task.question}
             </div>
             <div className="flex flex-col gap-2">
               {task.options.map((opt: string, i: number) => (
                 <label key={i} className="flex items-center gap-2 cursor-pointer group">
                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${task.value === opt ? "border-limeGreen" : "border-sageGreen/30"}`}>
                      {task.value === opt && <div className="w-2.5 h-2.5 rounded-full bg-limeGreen" />}
                   </div>
                   <span className={`text-sm ${task.value === opt ? "text-deepTeal font-semibold" : "text-sageGreen group-hover:text-deepTeal"}`}>{opt}</span>
                 </label>
               ))}
             </div>
          </div>
        );
      case "range":
        return (
          <div className="space-y-4 p-4 rounded-lg border border-sageGreen/10 bg-white">
             <div className="flex items-center justify-between text-sm font-bold text-deepTeal">
                <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-sageGreen" /> {task.question}</div>
                <span className="bg-parchment px-2 py-0.5 rounded text-sageGreen">{task.value} / {task.max}</span>
             </div>
             <input type="range" min={task.min} max={task.max} defaultValue={task.value} className="w-full accent-deepTeal h-1.5 bg-parchment rounded-lg appearance-none cursor-pointer"/>
             <div className="flex justify-between text-xs text-sageGreen px-1">
                <span>Low ({task.min})</span>
                <span>High ({task.max})</span>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans text-deepTeal">
      
      {/* --- TOP SECTION (Not sticky anymore) --- */}
      <div className="bg-white border-b border-sageGreen/10 shadow-sm">
        <div className="max-w-[1600px] mx-auto w-full px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* LEFT: Back Button + Title Info */}
            <div className="flex items-start gap-6 flex-1">
              <Link 
                href="/work-orders" 
                className="mt-2 group flex items-center justify-center w-12 h-12 bg-white border border-sageGreen/20 rounded-xl hover:bg-deepTeal hover:border-deepTeal transition-all shadow-sm"
              >
                <ArrowLeft className="w-6 h-6 text-sageGreen group-hover:text-white transition-colors" />
              </Link>
              
              <div className="space-y-3">
                 {/* ID Badge */}
                 <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 bg-deepTeal text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                      <Hash className="w-3.5 h-3.5 opacity-70" /> {workOrder.id}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {workOrder.priority}
                    </span>
                 </div>

                 {/* Main Title */}
                 <h1 className="text-3xl md:text-4xl font-bold text-deepTeal leading-[1.1] tracking-tight">
                   {workOrder.title}
                 </h1>
              </div>
            </div>
            
            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3 self-start mt-2">
              <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-lg border border-sageGreen/20 font-bold text-deepTeal hover:bg-parchment transition-colors">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center justify-center w-12 h-12 bg-white border border-sageGreen/20 rounded-xl hover:bg-deepTeal hover:border-deepTeal transition-all shadow-sm group"
                >
                  <MoreVertical className="w-6 h-6 text-sageGreen group-hover:text-white transition-colors" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-sageGreen/20 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-deepTeal hover:bg-parchment/80 transition-colors border-b border-sageGreen/10 last:border-b-0">
                      <Edit className="w-4 h-4 text-sageGreen" /> Edit Details
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-deepTeal hover:bg-parchment/80 transition-colors border-b border-sageGreen/10 last:border-b-0">
                      <Copy className="w-4 h-4 text-sageGreen" /> Duplicate WO
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-deepTeal hover:bg-parchment/80 transition-colors border-b border-sageGreen/10 last:border-b-0">
                      <ArrowLeft className="w-4 h-4 text-sageGreen" /> Skip Workorder
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete WorkOrder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === LEFT COLUMN (8/12) === */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. DESCRIPTION */}
          <section className="bg-white rounded-xl border border-sageGreen/10 shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-deepTeal" />
            <h3 className="text-xs font-bold text-sageGreen uppercase tracking-wider mb-4 flex items-center gap-2">
               <AlignLeft className="w-4 h-4" /> Description & Instructions
            </h3>
            <p className="text-lg leading-relaxed text-deepTeal font-medium">{workOrder.description}</p>
          </section>

          {/* 2. ASSET CONTEXT */}
          <section className="bg-white rounded-xl border border-sageGreen/10 shadow-sm overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0">
                <ContextTile icon={MapPin} label="Location" value={workOrder.context.location} />
                <ContextTile icon={Layers} label="Zone" value={workOrder.context.zone} />
                <ContextTile icon={Box} label="Subzone" value={workOrder.context.subzone} />
                <ContextTile icon={Wrench} label="Asset" value={workOrder.context.asset} subLabel={workOrder.context.assetId} />
             </div>
          </section>

          {/* 3. TABS */}
          <section className="bg-white rounded-xl border border-sageGreen/10 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center border-b border-sageGreen/10 bg-parchment/30 overflow-x-auto">
              {[
                { id: "tasks", label: "Tasks & Data", icon: CheckSquare },
                { id: "parts", label: "Parts & Items", icon: Archive },
                { id: "resources", label: "Time & Cost", icon: Clock },
                { id: "chat", label: "Chat", icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 text-sm font-medium flex items-center gap-2 border-r border-sageGreen/10 transition-all relative whitespace-nowrap
                    ${activeTab === tab.id 
                      ? "bg-white text-deepTeal font-bold" 
                      : "text-sageGreen hover:text-deepTeal hover:bg-white/50"}
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute top-0 left-0 w-full h-[3px] bg-limeGreen" />}
                </button>
              ))}
            </div>
            
            <div className="p-8 flex-1 bg-white">
               
               {/* --- TAB: TASKS --- */}
               {activeTab === "tasks" && (
                  <div className="max-w-3xl space-y-6">
                    <div className="flex justify-between items-end border-b border-sageGreen/10 pb-4 mb-6">
                      <h2 className="font-bold text-xl text-deepTeal">Checklist & Readings</h2>
                      <span className="text-xs font-bold text-deepteal bg-parchment px-3 py-1.5 rounded-lg border border-limeGreen/20">25% Complete</span>
                    </div>
                    {workOrder.tasks.map((task) => (
                     <div key={task.id}>
                       {renderFormInput(task)}
                     </div>
                    ))}
                    <div className="pt-6 flex justify-end">
                     <button className="bg-deepTeal hover:bg-limeGreen text-white font-bold px-6 py-3 rounded-lg shadow transition-all text-sm flex items-center gap-2">
                      Submit
                     </button>
                    </div>
                  </div>
               )}

               {/* --- TAB: CHAT --- */}
               {activeTab === "chat" && (
                 <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                       {workOrder.activityLog.map((log, i) => (
                          <div key={i} className="flex gap-4 group">
                             <div className="w-10 h-10 rounded-full bg-sageGreen/10 flex items-center justify-center text-xs font-bold text-deepTeal ring-4 ring-white">{log.user.charAt(0)}</div>
                             <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                  <span className="font-bold text-deepTeal text-sm">{log.user}</span>
                                  <span className="text-[10px] text-sageGreen uppercase tracking-wider">{log.time}</span>
                                </div>
                                {log.message && <div className="mt-2 bg-parchment/40 p-4 rounded-lg rounded-tl-none text-sm text-deepTeal leading-relaxed shadow-sm">{log.message}</div>}
                                {log.action && <div className="mt-1 text-xs italic text-sageGreen border-l-2 border-sageGreen/20 pl-2">{log.action}</div>}
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-sageGreen/10 relative">
                       <textarea className="w-full bg-white border border-sageGreen/20 rounded-lg p-4 pr-12 text-sm focus:border-limeGreen focus:ring-1 focus:ring-limeGreen outline-none shadow-sm resize-none" rows={3} placeholder="Type a message or update..." />
                       <button className="absolute right-3 bottom-3 p-2 bg-deepTeal text-white rounded-md hover:bg-limeGreen transition-colors">
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               )}

               {activeTab === "parts" && (
                 <div className="flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="flex justify-between items-end mb-6">
                       <div>
                          <h2 className="font-bold text-2xl text-deepTeal">Inventory & Parts</h2>
                          <p className="text-sageGreen mt-1 text-sm font-medium">Manage materials assigned to this work order.</p>
                       </div>
                       <button className="flex items-center gap-2 bg-deepTeal text-white px-5 py-2.5 rounded-lg hover:bg-limeGreen hover:text-deepTeal transition-all shadow-sm text-sm font-bold group">
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add Part
                       </button>
                    </div>

                    {/* Parts Table */}
                    <div className="border border-sageGreen/10 rounded-xl overflow-hidden shadow-sm">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-parchment/50 text-sageGreen text-[10px] uppercase font-bold tracking-widest border-b border-sageGreen/10">
                             <tr>
                                <th className="px-10 py-4 w-[320px]">Part Details</th>
                                <th className="px-2 py-4 w-[90px]">Stock Status</th>
                                <th className="px-6 py-4 text-center">Qty</th>
                                <th className="px-6 py-4 text-right">Unit Cost</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4"></th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-sageGreen/10 bg-white">
                             {workOrder.parts.map((part) => (
                                <tr key={part.id} className="hover:bg-parchment/20 transition-colors group">
                                   <td className="px-10 py-4 max-w-[320px] whitespace-nowrap overflow-hidden text-ellipsis">
                                      <div className="font-bold text-deepTeal text-sm truncate">{part.name}</div>
                                      <div className="font-mono text-xs text-sageGreen mt-0.5 flex items-center gap-2 truncate">
                                         <Hash className="w-3 h-3 opacity-50"/> {part.sku}
                                      </div>
                                   </td>
                                   <td className="px-2 py-4 w-[90px]">
                                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border min-w-[60px] justify-center whitespace-nowrap overflow-hidden text-ellipsis ${
                                            part.stockLevel === 'Low' 
                                            ? "bg-red-50 text-red-700 border-red-100" 
                                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                          }`} style={{maxWidth: '90px'}}>
                                            <span className="flex items-center gap-1 whitespace-nowrap">
                                             {part.stockLevel === 'Low' ? <AlertCircle className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3" />}
                                             <span className="truncate">{part.stock}</span>
                                            </span>
                                          </span>
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <div className="inline-flex items-center bg-parchment/50 rounded-lg border border-sageGreen/10 px-2 py-1">
                                         <span className="font-mono text-sm font-bold text-deepTeal">{part.qty}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-right font-mono text-sm text-sageGreen">
                                      ${part.cost.toFixed(2)}
                                   </td>
                                   <td className="px-6 py-4 text-right font-mono text-sm font-bold text-deepTeal">
                                      ${(part.cost * part.qty).toFixed(2)}
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      <button className="p-2 hover:bg-red-50 text-sageGreen hover:text-red-600 rounded-lg transition-colors">
                                         <Trash2 className="w-4 h-4" />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                          {/* Footer Total */}
                          <tfoot className="bg-parchment/30 border-t border-sageGreen/10">
                             <tr>
                                <td colSpan={4} className="px-6 py-4 text-right text-xs font-bold text-sageGreen uppercase tracking-widest">Total Parts Cost</td>
                                <td className="px-6 py-4 text-right font-mono text-lg font-black text-deepTeal">
                                   ${workOrder.parts.reduce((acc, part) => acc + (part.cost * part.qty), 0).toFixed(2)}
                                </td>
                                <td></td>
                             </tr>
                          </tfoot>
                       </table>
                    </div>
                 </div>
               )}

               {/* --- TAB: RESOURCES (TIME & COST) --- */}
               {/* --- TAB: RESOURCES (PARALLEL LAYOUT) --- */}
               {activeTab === "resources" && (
                 <div className="flex flex-col h-full">
                    
                    {/* Grand Summary Header */}
                    <div className="flex items-center justify-between mb-8 p-6 bg-deepTeal rounded-2xl text-white shadow-lg relative overflow-hidden">
                       <div className="relative z-10">
                          <h2 className="text-2xl font-black tracking-tight">Resource Overview</h2>
                          <p className="text-limeGreen/80 text-sm font-medium mt-1">Total consumption for this work order.</p>
                       </div>
                       
                       <div className="flex gap-8 relative z-10 text-right">
                          <div>
                             <div className="text-xs font-bold uppercase tracking-widest opacity-60">Total Time</div>
                             <div className="text-3xl font-black text-white">4h 30m</div>
                          </div>
                          <div className="w-px bg-white/10"></div>
                          <div>
                             <div className="text-xs font-bold uppercase tracking-widest opacity-60">Total Cost</div>
                             <div className="text-3xl font-black text-limeGreen">$763.75</div>
                          </div>
                       </div>
                       
                       {/* Deco */}
                       <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                    </div>

                    {/* PARALLEL TRACKS CONTAINER */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                       
                       {/* === LEFT TRACK: TIME (LABOR) === */}
                       <div className="flex flex-col bg-parchment/30 rounded-2xl border border-sageGreen/10 overflow-hidden">
                          {/* Track Header */}
                          <div className="p-5 border-b border-sageGreen/10 flex justify-between items-center bg-white">
                             <h3 className="font-bold text-lg text-deepTeal flex items-center gap-2">
                                <Clock className="w-5 h-5 text-sageGreen" /> Labor & Time
                             </h3>
                             <button className="text-xs font-bold text-deepTeal bg-parchment hover:bg-deepTeal hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-sageGreen/10">
                                + Log Time
                             </button>
                          </div>
                          
                          {/* Scrollable List */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                             {workOrder.timeLog.map((log) => (
                                <div key={log.id} className="group flex items-center justify-between p-4 bg-white border border-sageGreen/10 rounded-xl hover:border-deepTeal/20 hover:shadow-sm transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center text-deepTeal font-bold text-xs group-hover:bg-deepTeal group-hover:text-white transition-colors">
                                         {log.user.charAt(0)}
                                      </div>
                                      <div>
                                         <div className="font-bold text-sm text-deepTeal">{log.user}</div>
                                         <div className="text-[11px] font-bold text-sageGreen uppercase tracking-wider flex items-center gap-2 mt-0.5">
                                            <span>{log.date}</span>
                                            <span className="w-1 h-1 bg-sageGreen/40 rounded-full"></span>
                                            <span>{log.type}</span>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="font-mono font-black text-base text-deepTeal">{log.duration}</div>
                                      <div className="text-xs text-sageGreen font-mono">${log.rate}/hr</div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* === RIGHT TRACK: MONEY (EXPENSES) === */}
                       <div className="flex flex-col bg-parchment/30 rounded-2xl border border-sageGreen/10 overflow-hidden">
                          {/* Track Header */}
                          <div className="p-5 border-b border-sageGreen/10 flex justify-between items-center bg-white">
                             <h3 className="font-bold text-lg text-deepTeal flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-sageGreen" /> Financials
                             </h3>
                             <button className="text-xs font-bold text-deepTeal bg-parchment hover:bg-deepTeal hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-sageGreen/10">
                                + Add Expense
                             </button>
                          </div>
                          
                          {/* Scrollable List */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                             {/* Parts Summary Row */}
                             <div className="flex items-center justify-between p-4 bg-white border border-sageGreen/10 rounded-xl opacity-80">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-parchment flex items-center justify-center text-sageGreen">
                                      <Archive className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <div className="font-bold text-sm text-deepTeal">Parts Inventory</div>
                                      <div className="text-[11px] text-sageGreen uppercase tracking-wider font-bold">Automatic Calculation</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="font-mono font-bold text-base text-deepTeal">$170.00</div>
                                   <div className="text-[10px] text-sageGreen uppercase tracking-wider font-bold">3 Items</div>
                                </div>
                             </div>

                             {/* Expenses List */}
                             {workOrder.expenses.map((exp) => (
                                <div key={exp.id} className="flex items-center justify-between p-4 bg-white border border-sageGreen/10 rounded-xl hover:border-deepTeal/20 hover:shadow-sm transition-all border-l-4 border-l-sageGreen/30">
                                   <div>
                                      <div className="font-bold text-sm text-deepTeal">{exp.item}</div>
                                      <div className="text-[11px] text-sageGreen uppercase tracking-wider font-bold mt-0.5">{exp.category}</div>
                                   </div>
                                   <div className="text-right">
                                      <div className="font-mono font-black text-base text-deepTeal">${exp.cost.toFixed(2)}</div>
                                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${exp.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                         {exp.status}
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                    </div>
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* === RIGHT COLUMN (4/12) === */}
        <div className="lg:col-span-4 space-y-6 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto">
          
          {/* 1. STATUS CARD (Fixed sizing) */}
          <section className="bg-white rounded-xl border border-sageGreen/10 shadow-sm p-6 pb-8">
            <label className="text-xs font-bold text-sageGreen uppercase tracking-wider mb-3 block">Current Status</label>
            <div className="relative">

              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full appearance-none font-bold text-sm px-4 py-3 rounded-lg border focus:outline-none focus:ring-4 focus:ring-limeGreen/10 cursor-pointer transition-all ${getStatusColor(status)}`}
              >
                <option value="ToDo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <ChevronDown className="absolute right-4 top-4 w-4 h-4 opacity-50 pointer-events-none" />
            </div>

            {status === "Done" ? (
              <div className="mt-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <button className="w-full flex items-center justify-center gap-2 bg-white text-deepTeal p-4 rounded-lg border-2 border-deepTeal hover:bg-deepTeal hover:text-white transition-all shadow-sm group">
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Generate Report</span>
                </button>
              </div>
            ) : (
              <div className="mb-6" />
            )}

            <div className="mt-8 pt-6 border-t border-sageGreen/10 space-y-4">
               <div className="mt-2">
                 <div className="text-[10px] font-bold text-sageGreen uppercase tracking-wider mb-1 flex items-center gap-1">
                    <PlayCircle className="w-3 h-3"/> Created
                 </div>
                 <div className="text-sm font-bold text-deepTeal">{workOrder.createdAt}</div>
               </div>
               <div>
                 <div className="text-[10px] font-bold text-sageGreen uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3"/> Due Date
                 </div>
                 <div className="text-sm font-bold text-deepTeal">{workOrder.dueDate}</div>
               </div>
            </div>
          </section>

          {/* 2. PARTICIPANTS */}
          <section className="bg-white rounded-xl border border-sageGreen/10 shadow-sm overflow-hidden">
            <div className="bg-parchment/30 px-6 py-4 border-b border-sageGreen/10 flex justify-between items-center">
              <h3 className="font-bold text-sm text-deepTeal">Participants</h3>
              <button className="text-xs text-deepteal hover:text-limegreen font-medium flex items-center gap-1 bg-white border border-sageGreen/10 px-2 py-1 rounded shadow-sm"><UserPlus className="w-3 h-3" /> Add</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-sageGreen uppercase tracking-wider mb-3">Assigned</h4>
                <div className="space-y-3">
                  {workOrder.participants.assigned.map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.color} text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white`}>{user.initials}</div>
                      <div>
                        <div className="text-sm font-bold text-deepTeal">{user.name}</div>
                        <div className="text-xs text-sageGreen">{user.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                 <h4 className="text-[10px] font-bold text-sageGreen uppercase tracking-wider mb-3 border-t border-sageGreen/10 pt-4 flex items-center gap-2"><Eye className="w-3 h-3"/> Monitors</h4>
                <div className="space-y-3">
                  {workOrder.participants.monitors.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                      <div className={`w-8 h-8 rounded-full ${user.color} text-white flex items-center justify-center text-[10px] font-bold`}>{user.initials}</div>
                      <div>
                        <div className="text-sm font-medium text-deepTeal">{user.name}</div>
                        <div className="text-[10px] text-sageGreen">{user.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}