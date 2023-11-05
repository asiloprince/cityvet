import { Link } from "react-router-dom";
import Prediction from "../../../components/charts/Prediction";

const DispersalPredictions = () => {
  return (
    <div>
      {" "}
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
      <div className="bg-gray-100 rounded-lg shadow-md p-4">
        <Prediction />
      </div>
    </div>
  );
};

export default DispersalPredictions;
