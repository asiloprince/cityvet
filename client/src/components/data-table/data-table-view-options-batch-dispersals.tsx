import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { downloadToExcelBatchDispersals } from "../../lib/xlsx";
import { Download, SlidersHorizontal } from "lucide-react";

// rename toggle column names
const columnNames: { [key: string]: string } = {
  barangay_name: "Barangay",
  ear_tag: "Eartag",
  category: "Receive Animals",
  current_beneficiary: "Name",
  status: "Status",
  init_num_heads: "Initial Number of Heads",
  dispersal_date: "Date",
};

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptionsBatchDispersals<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex justify-between">
      <div className="mx-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          onClick={() => downloadToExcelBatchDispersals()}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnNames[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
