import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../components/ui/checkbox";
import { Recipients } from "../../../sampledata/benefeciariesData";
import { Clipboard, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";

export const columns: ColumnDef<Recipients>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Recipient ID" />;
    },

    accessorKey: "ID",
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Full Name" />;
    },
    accessorKey: "Name",
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Barangay" />;
    },
    accessorKey: "Barangay",
    filterFn: (row, value) => {
      return value.includes(row.getValue(value));
    },
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Birthdate" />;
    },
    accessorKey: "Birthdate",
  },
  {
    header: "Contact",
    accessorKey: "ContactNumber",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const recipient = row.original;
      const recipientId = recipient.ID;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full w-8 h-8 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <MoreHorizontal />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(recipientId);
              }}
            >
              <Clipboard className="mr-2 h-4 w-4" /> Copy recipient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
