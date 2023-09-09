import { ColumnDef } from "@tanstack/react-table";
import { Recipients } from "../../../sampledata/benefeciariesData";
import {
  FaEllipsisH,
  FaRegCopy,
  FaRegEye,
  FaRegEdit,
  FaRegTrashAlt,
  FaSortAmountDown,
} from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export const columns: ColumnDef<Recipients>[] = [
  {
    header: ({ column }) => {
      return (
        <button
          className="bg-transparent text-gray-600 font-semibold py-2 px-4 "
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Recipients Id
          <FaSortAmountDown className="inline-block h-4 w-4 ml-2" />
        </button>
      );
    },
    accessorKey: "ID",
  },
  {
    header: "FullName",
    accessorKey: "Name",
  },
  {
    header: "Barangay",
    accessorKey: "Barangay",
  },
  {
    header: "Date of Birth",
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
