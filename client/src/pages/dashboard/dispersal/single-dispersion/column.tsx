import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
import { DispersalType } from "./schema";
import { barangays } from "../../../../components/data-table/barangay-filter-utils";
import { statuses } from "../../../../components/data-table/data-table-status-filter";
import { DataTableRowActions } from "../../../../components/data-table/data-table-row-actions";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });

  return `${year} ${month}`;
}

export const columns: ColumnDef<DispersalType>[] = [
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
    accessorKey: "current_beneficiary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "ear_tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eartag" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Animal Recieved" />
    ),
  },

  {
    accessorKey: "dispersal_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dispersal Date" />
    ),
    cell: ({ row }) => {
      const dateValue: string = row.getValue("dispersal_date"); // Annotate dateValue as string
      const formattedDate = formatDate(dateValue);

      return (
        <div className="flex w-[150px] items-center text-xs">
          <span>{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "init_num_heads",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initial Heads" />
    ),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
