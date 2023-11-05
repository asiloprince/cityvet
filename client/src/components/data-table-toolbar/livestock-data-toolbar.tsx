import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptionsLivestocks } from "../data-table/data-table-view-options-livestocks";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";

import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { category } from "../../pages/dashboard/livestock/livestock-status";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function LivestockToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search Name"
          value={(table.getColumn("ear_tag")?.getFilterValue() as string) || ""}
          onChange={(e) => {
            table.getColumn("ear_tag")?.setFilterValue(e.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={category}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptionsLivestocks table={table} />
    </div>
  );
}
