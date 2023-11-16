import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BoxHeader from "../box-header/BoxHeader";

interface DataItem {
  year: number;
  month: number;
  week: number;
  dispersals: number;
  redispersals: number;
}

const monthNames: { [key: number]: string } = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const DispersalAndRedispersalAreaCharts: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [timePeriod, setTimePeriod] = useState("Month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_PUBLIC_API_URL
          }/kpi/dispersals-redispersals?timePeriod=${timePeriod}`,
          { withCredentials: true }
        );
        let reshapedData: DataItem[] = Object.values(response.data.data);
        let filteredData: DataItem[] = [];
        if (timePeriod === "Week") {
          filteredData = reshapedData.filter(
            (item: DataItem) => item.week !== null
          );
          filteredData = filteredData.map((item) => ({
            ...item,
            timePeriodName: `${monthNames[item.month]} - Week ${item.week}`,
          }));
        } else if (timePeriod === "Month") {
          filteredData = reshapedData.filter(
            (item: DataItem) => item.month !== null
          );
          filteredData = filteredData.map((item) => ({
            ...item,
            timePeriodName: monthNames[item.month],
          }));
        } else if (timePeriod === "Year") {
          filteredData = reshapedData.filter(
            (item: DataItem) => item.year !== null
          );
          filteredData = filteredData.map((item) => ({
            ...item,
            timePeriodName: item.year.toString(),
          }));
        }

        // Sort the data by year, month, and week
        filteredData.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          } else if (a.month !== b.month) {
            return a.month - b.month;
          } else {
            return a.week - b.week;
          }
        });

        filteredData = filteredData.map((item) => ({
          ...item,
          monthName: monthNames[item.month],
        }));
        console.log(filteredData);
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [timePeriod]);

  const handleTimePeriodChange = (newTimePeriod: string) => {
    setTimePeriod(newTimePeriod);
  };

  return (
    <div className="  bg-white p-2 h-auto sm:px-7.5 xl:col-span-8 text-text-primary mt-4 rounded-md">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <BoxHeader
            title="Dispersals and Redispersals Over Time"
            subtitle="Dispersal trends shown by original dispersal dates, redispersal trends shown by offspring redispersal dates"
            sideText="+10% total dispersals"
          />
        </div>
        <div className="flex w-full max-w-45 justify-end ">
          <div className="inline-flex items-center rounded-md bg-gray-200 p-1 ">
            <button
              onClick={() => handleTimePeriodChange("Week")}
              className={`rounded py-1 px-3 text-xs font-medium ${
                timePeriod === "Week" ? "bg-white" : ""
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimePeriodChange("Month")}
              className={`rounded py-1 px-3 text-xs font-medium ${
                timePeriod === "Month" ? "bg-white" : ""
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimePeriodChange("Year")}
              className={`rounded py-1 px-3 text-xs font-medium ${
                timePeriod === "Year" ? "bg-white" : ""
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDispersals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRedispersals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00CED1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00CED1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey={
              timePeriod === "Month" ? "monthName" : timePeriod.toLowerCase()
            }
            tickLine={false}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            tickLine={false}
            style={{ fontSize: "12px" }}
            axisLine={{ strokeWidth: 0 }}
          />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip />
          <Area
            type="monotone"
            dot={true}
            dataKey="dispersals"
            stroke="#3C50E0"
            fillOpacity={1}
            fill="url(#colorDispersals)"
          />
          <Area
            type="monotone"
            dot={true}
            dataKey="redispersals"
            stroke="#3C50E0"
            fillOpacity={1}
            fill="url(#colorRedispersals)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DispersalAndRedispersalAreaCharts;
