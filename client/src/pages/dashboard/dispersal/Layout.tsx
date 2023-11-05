import { useState } from "react";
import DisperseLivestock from "./single-dispersion/DisperseLivestock";
import DisperseNonEarTag from "./multiple-dispersal/DisperseNonEarTag";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

function LayoutDispersal() {
  const [currentTable, setCurrentTable] = useState("dispersal");

  const tableHandlers = (table: string) => {
    setCurrentTable(table);
  };

  const navigate = useNavigate();

  const disperseDirectHandler = () => {
    navigate("/disperse");
  };
  const batchDisperseDirectHandler = () => {
    navigate("/batch-disperse");
  };

  return (
    <div className="max-w-7x1 m-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <div className="flex justify-between mr-4">
          <h1 className="text-2xl font-bold mb-4">Dispersal</h1>
          <Button
            variant={"outline"}
            className="mx-2"
            onClick={() => tableHandlers("dispersal")}
          >
            Single Entries
          </Button>
          <Button
            variant={"outline"}
            className="mx-2"
            onClick={() => tableHandlers("non-earTag")}
          >
            Batch Entries
          </Button>
        </div>
        <div className="flex justify-between m-2">
          <Button
            className="font-poppin text-white text-sm mr-2 bg-cyan-600 rounded  hover:bg-cyan-700"
            onClick={disperseDirectHandler}
          >
            Disperse
          </Button>
          <Button
            className="font-poppin text-white text-sm ml-2 bg-cyan-600 rounded  hover:bg-cyan-700"
            onClick={batchDisperseDirectHandler}
          >
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
