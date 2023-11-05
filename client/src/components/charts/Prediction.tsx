import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression from "regression";
import axios from "axios";
import BoxHeader from "../box-header/BoxHeader";

interface ApiData {
  year: number;
  month: number;
  total: number;
}

type DataPoint = {
  month: string;
  total?: number;
  trendline?: number;
  prediction?: number;
};

function Prediction() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_PUBLIC_API_URL}/kpi/dispersals-prediction`, {
        withCredentials: true,
      })
      .then((response) => {
        const apiData: ApiData[] = response.data.data;

        // Perform linear regression
        const regressionResult = regression.linear(
          apiData.map((item: ApiData, index) => [index, item.total])
        );
        // Generate predictions for all data points
        let formattedData = apiData.map((item: ApiData, index) => {
          const point: DataPoint = {
            month: `${item.year}-${item.month}`,
            total: item.total,
            trendline: regressionResult.predict(index)[1],
          };

          if (showPredictions) {
            point.prediction = regressionResult.predict(index)[1]; // Predict for all data points
          }

          return point;
        });

        // Generate predictions for the next year
        const predictionsNextYear = Array.from({ length: 12 }, (_, i) => {
          const nextMonthIndex = apiData.length + i;
          const prediction = regressionResult.predict(nextMonthIndex)[1];

          return {
            month: `2024-${i + 1}`,
            total: undefined,
            trendline: undefined,
            prediction,
          };
        });

        // Add predictions for the next year to a separate dataset
        if (showPredictions) {
          setData([...formattedData, ...predictionsNextYear]);
        } else {
          setData(formattedData);
        }

        // Log all predictions for the next year
        console.log("Predictions for next year:", predictionsNextYear);
      })
      .catch((error) => console.error(error));
  }, [showPredictions]);

  return (
    <div>
      <div>
        <BoxHeader
          title="Dispersal Trend Analysis"
          subtitle="Visualizing the trend of dispersals over time"
          sideText="Data from 2023"
        />
        <div className="flex justify-end">
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded ml-4"
            onClick={() => setShowPredictions(!showPredictions)}
          >
            Toggle Predictions
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 75, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={"#8884d8"} />
          <XAxis dataKey="month" tickLine={false} style={{ fontSize: "10px" }}>
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis axisLine={{ strokeWidth: "0" }} style={{ fontSize: "10px" }}>
            <Label
              value="Number of Dispersals"
              angle={-90}
              offset={-5}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="total"
            stroke={"#8884d8"}
            strokeWidth={0}
            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="trendline"
            stroke="#8884d8"
            dot={false}
          />
          {showPredictions && (
            <Line
              strokeDasharray="5 5"
              dataKey="prediction"
              stroke="#8884d8"
              dot={false}
              connectNulls={true} // Add this line
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Prediction;
