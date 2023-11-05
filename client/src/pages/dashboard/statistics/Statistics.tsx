import { Link } from "react-router-dom";
import DispersalAndRedispersalAreaCharts from "../../../components/charts/DispersalAndRedispersal";
import BeneficiariesByGender from "../../../components/charts/BeneficiariesByGender";
import DispersedLivestocksStackBar from "../../../components/charts/DispersedLivestocksStackBar";
import DispersedLivestocksPieChart from "../../../components/charts/DisperseLivestocksPieChart";

function Statistics() {
  return (
    <>
      <div className="bg-white text-black p-4 flex justify-between border-b border-gray-200">
        <div className="font-semibold">Analytics</div>
        <div>
          <span>
            <Link to={"/statistics"}>Dashboard</Link>
          </span>{" "}
          /{" "}
          <span>
            <Link to={"/predictions"}>Predictions</Link>
          </span>{" "}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="col-span-2 bg-white rounded shadow p-4">
          {/* Graph */}
          <DispersalAndRedispersalAreaCharts />
        </div>

        <div className="col-span-1 bg-white rounded shadow p-4">
          <DispersedLivestocksPieChart />
        </div>
        <div className="col-span-1 bg-white rounded shadow p-4">
          {/* Graph */}
          <BeneficiariesByGender />
        </div>
        {/* <div className="col-span-2 bg-white rounded shadow p-4"></div>
        <div className="col-span-1 bg-white rounded shadow p-4"></div> */}
        <div className="col-span-2 bg-white rounded shadow p-4">
          <DispersedLivestocksStackBar />
        </div>
        {/* <div className="col-span-1 bg-white rounded shadow p-4">


          <div title="Additional Container" />
        </div> */}
      </div>
    </>
  );
}

export default Statistics;
