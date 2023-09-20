import { DispersalDataTable } from "./data-table";
import { dispersal } from "../../../../sampledata/dispersalData";
import { columns } from "./column";

function Dispersal() {
  return (
    <div>
      <DispersalDataTable columns={columns} data={dispersal} />
    </div>
  );
}

export default Dispersal;
