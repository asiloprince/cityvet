import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";
import { LivestockDataTableRowActions } from "./data-table-livestock-actions";
import { LivestocksType } from "../../schema";
import { category } from "./livestock-status";

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
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Animal" />;
    },
    cell: ({ row }) => {
      const categories = category.find(
        (categories) => categories.value === row.getValue("category")
      );

      if (!categories) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{categories.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
