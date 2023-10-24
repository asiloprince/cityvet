import { useState } from "react";
import DisperseLivestock from "./single-dispersion/DisperseLivestock";
import DisperseNonEarTag from "./multiple-dispersal/DisperseNonEarTag";
import { Button } from "../../../components/ui/button";

function LayoutDispersal() {
  const [currentTable, setCurrentTable] = useState("dispersal");

  const tableHandlers = (table: string) => {
    setCurrentTable(table);
  };

  const disperseDirectHandler = () => {
    window.location.href = "disperse";
  };

  return (
    <div className="max-w-7x1 m-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <div className="flex justify-between mr-4">
          <h1 className="text-2xl font-bold mr-3">Dispersal</h1>
          <Button
            variant={"outline"}
            className="mx-2"
            onClick={() => tableHandlers("dispersal")}
          >
            Tagged Records
          </Button>
          <Button
            variant={"outline"}
            className="mx-2"
            onClick={() => tableHandlers("non-earTag")}
          >
            Untagged Records
          </Button>
        </div>
        <div className="flex justify-between m-2">
          <Button
            className="font-poppin text-white text-sm mr-2 bg-cyan-600 rounded  hover:bg-cyan-700"
            onClick={disperseDirectHandler}
          >
            Disperse
          </Button>
          <Button className="font-poppin text-white text-sm ml-2 bg-cyan-600 rounded  hover:bg-cyan-700">
            Batch Disperse
          </Button>
        </div>
      </div>
      {currentTable === "dispersal" && <DisperseLivestock />}
      {currentTable === "non-earTag" && <DisperseNonEarTag />}
    </div>
  );
}

export default LayoutDispersal;
