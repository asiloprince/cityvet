import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../components/ui/checkbox";
import { RecipientsType } from "../../schema";

import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";
import { barangays } from "../../../components/data-table/barangay-filter-utils";
import { RecipientDataTableRowActions } from "./dialogs/data-table-recipient-actions";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  return `${year} ${month} ${day}`;
}

export const columns: ColumnDef<RecipientsType>[] = [
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
      return <DataTableColumnHeader column={column} title="Full Name" />;
    },
    accessorKey: "full_name",
  },
  {
    accessorKey: "barangay_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barangay" />
    ),
    cell: ({ row }) => {
      const barangay_name = barangays.find(
        (barangay_name) => barangay_name.value === row.getValue("barangay_name")
      );

      if (!barangay_name) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{barangay_name.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Birthdate" />;
    },
    accessorKey: "birth_date",
    cell: ({ row }) => {
      const dateValue: string = row.getValue("birth_date");
      const formattedDate = formatDate(dateValue);

      return (
        <div className="flex w-[150px] items-center ">
          <span>{formattedDate}</span>
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Contact" />;
    },
    accessorKey: "mobile",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <RecipientDataTableRowActions row={row} />,
  },
];
