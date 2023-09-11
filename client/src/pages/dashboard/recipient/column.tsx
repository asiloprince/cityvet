import { ColumnDef } from "@tanstack/react-table";
import { Recipients } from "../../../sampledata/benefeciariesData";
import {
  FaEllipsisH,
  FaRegCopy,
  FaRegEye,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";

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
              <FaEllipsisH />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(recipientId);
              }}
            >
              <FaRegCopy className="mr-2 h-4 w-4" /> Copy recipient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FaRegEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaRegEdit className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <FaRegTrashAlt className="mr-2 h-4 w-4" />
              Delete Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
