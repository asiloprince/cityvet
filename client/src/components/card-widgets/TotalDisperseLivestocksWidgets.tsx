import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import axios from "axios";

type Props = {
  title: string;
  dataKey: string;
  percentage: number;
  chartData: object[];
};

function TotalDisperseLivestocksWidgets(props: Props) {
  const [total, setTotal] = useState({ dispersals: 0, redispersals: 0 });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_PUBLIC_API_URL}/kpi/dispersals/total`, {
        withCredentials: true,
      })
      .then((response) => {
        setTotal(response.data.data);
        console.log(response.data.data);
      });
  }, []);

  return (
    <div className="flex h-full ">
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <span className=" text-wrap text-center text-sm font-poppin sm:text-left">
            {props.title}
          </span>
        </div>
        <h1 className="font-bold text-2xl font-poppin">
          {total.dispersals}
          {/* <span className="font-bold text-sm">{props.percentage}</span> */}
        </h1>
        <Link to="/" className="text-xs">
          View All
        </Link>
      </div>

      <div className="flex flex-col h-full justify-between w-20 ">
        <div className="w-full h-full">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 60 }}
              />
              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke="aqua"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs">This week</span>
        </div>
      </div>
    </div>
  );
}

export default TotalDisperseLivestocksWidgets;
