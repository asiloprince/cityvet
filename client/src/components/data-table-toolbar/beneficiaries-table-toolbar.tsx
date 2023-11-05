import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptionsBeneficiaries } from "../data-table/data-table-view-options-beneficiaries";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";
import { barangays } from "../data-table/barangay-filter-utils";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BeneficiariesToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search Name"
          value={
            (table.getColumn("full_name")?.getFilterValue() as string) || ""
          }
          onChange={(e) => {
            table.getColumn("full_name")?.setFilterValue(e.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("barangay_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("barangay_name")}
            title="Barangay"
            options={barangays}
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
      <DataTableViewOptionsBeneficiaries table={table} />
    </div>
  );
}
