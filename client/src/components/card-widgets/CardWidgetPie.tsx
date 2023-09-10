import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  {
    name: "Cattle",
    value: 150,
    color: "#0088FE",
  },
  {
    name: "Goat",
    value: 200,
    color: "#008562",
  },
  {
    name: "Swine",
    value: 250,
    color: "#FFBB28",
  },
  {
    name: "Chickens",
    value: 600,
    color: "#00C49F",
  },
];

function CardWidgetPie() {
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
              dataKey="value"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between gap-4 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col  items-center">
            <div className="flex gap-2 items-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardWidgetPie;
