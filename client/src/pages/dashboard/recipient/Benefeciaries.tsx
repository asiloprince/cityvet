import { RecipientsDataTable } from "./data-table";
import { recipient } from "../../../sampledata/benefeciariesData";
import { columns } from "./column";

function Benefeciaries() {
  return (
    <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Benefeciaries</h1>
        <button className=" font-poppin text-white bg-cyan-600 py-2 px-4 rounded mb-4">
          Add new
        </button>
      </div>
      <div>
        <RecipientsDataTable columns={columns} data={recipient} />
      </div>
    </div>
  );
}

export default Benefeciaries;
