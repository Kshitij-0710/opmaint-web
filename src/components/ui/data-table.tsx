"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import { DataTableViewOptions } from "./drop-down";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [columnResizeMode] = useState<"onChange" | "onEnd">("onChange");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between">
         <div className="flex-1" /> 
         <DataTableViewOptions table={table} />
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-sageGreen/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
        
        {/* SCROLLBAR CUSTOMIZATION */}
        <div className="overflow-auto flex-1 relative scrollbar-thin scrollbar-thumb-deepTeal/40 scrollbar-track-transparent
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-deepTeal/40 
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-deepTeal/60
          transition-colors"
        > 
          <table
            className="w-full text-sm text-left border-collapse min-w-full"
            style={{ tableLayout: "fixed" }}
          >
            {/* Header */}
            <thead className="bg-deepTeal text-white uppercase tracking-wider font-bold text-xs shadow-md sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="relative group px-4 py-3 border-r border-white/10 last:border-r-0 select-none overflow-visible"
                    >
                      <div className="flex items-center justify-between">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>

                      {/* RESIZE HANDLE */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`
                          absolute top-0 h-full w-4 cursor-col-resize touch-none z-30 flex justify-center
                          -right-2
                        `}
                      >
                        <div 
                          className={`
                            h-full w-[2px] transition-colors
                            ${header.column.getIsResizing() 
                              ? "bg-limeGreen shadow-[0_0_8px_rgba(185,246,99,0.8)] opacity-100" 
                              : "bg-transparent opacity-0"}
                          `} 
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-sageGreen/10">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/work-orders/${row.getValue("id")}`)}
                  className={`
                    group transition-colors duration-150 cursor-pointer
                    ${i % 2 === 0 ? "bg-white" : "bg-parchment/40"} 
                    hover:bg-limeGreen/10
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border-r border-sageGreen/10 last:border-r-0 truncate text-deepTeal"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- REFINED PAGINATION --- */}
        <div className="border-t border-sageGreen/10 bg-white py-3 px-4 flex flex-col items-center justify-center gap-2">
            
            {/* Pagination Controls Pill */}
            <div className="flex items-center gap-2 bg-white border border-sageGreen/20 shadow-sm rounded-full px-3 py-2">
              
              {/* First Page */}
              <button className="p-2 rounded-full text-sageGreen hover:text-deepTeal hover:bg-sageGreen/10 transition-all disabled:opacity-30">
                 <ChevronsLeft className="w-4 h-4" />
              </button>
              
              {/* Prev */}
              <button className="p-2 rounded-full text-sageGreen hover:text-deepTeal hover:bg-sageGreen/10 transition-all disabled:opacity-30 mr-1">
                 <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Indicators */}
              <div className="flex items-center gap-1.5 px-3 border-l border-r border-sageGreen/10 h-8">
                 
                 {/* Active Page - Now bigger (w-9 h-9) and clearer (text-sm) */}
                 <button className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full bg-deepTeal text-white shadow-md">
                    1
                 </button>
                 
                 <button className="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full text-deepTeal hover:bg-sageGreen/10 transition-colors">
                    2
                 </button>
                 
                 <button className="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full text-deepTeal hover:bg-sageGreen/10 transition-colors">
                    3
                 </button>
                 
                 <span className="text-sageGreen text-xs px-1">●●●</span>
                 
                 <button className="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full text-deepTeal hover:bg-sageGreen/10 transition-colors">
                    12
                 </button>
              </div>

              {/* Next */}
              <button className="p-2 rounded-full text-sageGreen hover:text-deepTeal hover:bg-sageGreen/10 transition-all ml-1">
                 <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button className="p-2 rounded-full text-sageGreen hover:text-deepTeal hover:bg-sageGreen/10 transition-all">
                 <ChevronsRight className="w-4 h-4" />
              </button>

            </div>

            {/* Context Text */}
            <div className="text-[10px] font-medium text-sageGreen/70 tracking-wide uppercase">
              Page 1 of 12
            </div>

        </div>

      </div>
    </div>
  );
}