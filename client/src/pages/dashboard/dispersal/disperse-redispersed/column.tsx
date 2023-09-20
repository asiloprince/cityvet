import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
import { Dispersal } from "../../../../sampledata/dispersalData";

export const columns: ColumnDef<Dispersal>[] = [
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
    accessorKey: "earTag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ear Tag" />
    ),
  },
  {
    accessorKey: "livestock_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Livestock Type" />
    ),
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiary Name" />
    ),
  },
  {
    accessorKey: "dispersalDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dispersal Date" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
  },
];
