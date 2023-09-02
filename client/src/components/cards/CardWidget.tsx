import { Link } from "react-router-dom";
import { RiUserSharedFill } from "react-icons/ri";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

type Props = {
  title: string;
  number: number | string;
  dataKey: string;
  percentage: number;
  chartData: object[];
};

function CardWidget(props: Props) {
  return (
    <div className="flex h-full ">
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <RiUserSharedFill />
          <span className="font-bold text-wrap text-center sm:text-left">
            {props.title}
          </span>
        </div>
        <h1 className="font-bold">
          {props.number}{" "}
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

export default CardWidget;
