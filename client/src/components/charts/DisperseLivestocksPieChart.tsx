import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import BoxHeader from "../box-header/BoxHeader";

interface PieChartData {
  name: string;
  value: number;
}

const COLORS = [
  "#00FFFF",
  "#00E5EE",
  "#00CED1",
  "#00BFFF",
  "#87CEFA",
  "#87CEEB",
  "#7AC5CD",
];

const DispersedLivestocksPieChart: React.FC = () => {
  const [data, setData] = useState<PieChartData[]>([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_PUBLIC_API_URL}/kpi/disperse-livestocks/bar`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // Transform the data into the format expected by the chart
        const chartData = response.data.data.reduce((acc: any, curr: any) => {
          Object.entries(curr).forEach(([key, value]) => {
            if (key !== "month" && typeof value === "number") {
              if (acc[key]) {
                acc[key] += value;
              } else {
                acc[key] = value;
              }
            }
          });
          return acc;
        }, {});

        const pieChartData = Object.entries(chartData).reduce(
          (acc: PieChartData[], [name, value]) => {
            if (typeof value === "number") {
              acc.push({ name, value });
            } else {
              console.error("Unexpected value type: ", value);
            }
            return acc;
          },
          []
        );

        setData(pieChartData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const totalDisperseLivestocks = data.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <div>
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Dispersed Livestocks"
          subtitle="Distribution of dispersed livestocks shown by Category"
          sideText={`${totalDisperseLivestocks} total disperse`}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DispersedLivestocksPieChart;
