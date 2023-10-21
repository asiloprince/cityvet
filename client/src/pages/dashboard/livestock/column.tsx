import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";
import { LivestockDataTableRowActions } from "./data-table-livestock-actions";
import { LivestocksType } from "../../schema";

export const columns: ColumnDef<LivestocksType>[] = [
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
    accessorKey: "ear_tag",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Ear Tag" />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Animal" />;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Age" />;
    },
  },
  {
    accessorKey: "isAlive",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Alive" />;
    },
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => <LivestockDataTableRowActions row={row} />,
  },
];
