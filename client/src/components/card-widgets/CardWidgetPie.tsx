import axios from "axios";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colorMap = {
  Cattle: "#0088FE",
  Goat: "#008562",
  Swine: "#FFBB28",
  Chickens: "#00C49F",
};
interface DataItem {
  type: "Cattle" | "Goat" | "Swine" | "Chickens";
  total_heads: number;
}

function CardWidgetPie() {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/kpi/livestocks/total`,
          { withCredentials: true }
        );
        const dataWithNumericValues = res.data.data.map((item: DataItem) => ({
          ...item,
          total_heads: Number(item.total_heads),
        }));
        setData(dataWithNumericValues);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <h1>Livestock Category</h1>

      <div className="flex items-center justify-center">
        <ResponsiveContainer width="99%" height={160}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
            />

            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              dataKey="total_heads"
            >
              {data.map((item) => (
                <Cell key={item.type} fill={colorMap[item.type]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between gap-4 text-sm">
        {data.map((item) => (
          <div key={item.type} className="flex flex-col  items-center">
            <div className="flex gap-2 items-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colorMap[item.type] }}
              />
              <span>{item.type}</span>
            </div>
            <span>{item.total_heads}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardWidgetPie;
