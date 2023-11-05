import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import BoxHeader from "../box-header/BoxHeader";

interface ChartData {
  month: string;
  [key: string]: number | string;
}

const DispersedLivestocksStackBar: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_PUBLIC_API_URL}/kpi/disperse-livestocks/bar`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const totalDisperseLivestocks = data.reduce((total, item) => {
    Object.values(item).forEach((value) => {
      if (typeof value === "number") {
        total += value;
      }
    });
    return total;
  }, 0);

  return (
    <div>
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Dispersed Livestocks"
          subtitle="Distribution of dispersed livestocks shown by type"
          sideText={`${totalDisperseLivestocks} total disperse`}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Free Range Chickens" stackId="a" fill="#00FFFF" />
          <Bar dataKey="Broiler Chickens" stackId="a" fill="#00E5EE" />
          <Bar dataKey="Cattle" stackId="a" fill="#00CED1" />
          <Bar dataKey="CPDO Cattle" stackId="a" fill="#00BFFF" />
          <Bar dataKey="Goat - Doe" stackId="a" fill="#87CEFA" />
          <Bar dataKey="Goat - Buck" stackId="a" fill="#87CEEB" />
          <Bar dataKey="Goat" stackId="a" fill="#7AC5CD" />
          <Bar dataKey="Swine" stackId="a" fill="#66CDAA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DispersedLivestocksStackBar;
