import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import BoxHeader from "../box-header/BoxHeader";

const COLORS = ["#40E0D0", "#008B8B", "#40E0D0", "#7FFFD4", "#20B2AA"];

const renderActiveShape = (props: {
  cx: any;
  cy: any;
  midAngle: any;
  innerRadius: any;
  outerRadius: any;
  startAngle: any;
  endAngle: any;
  fill: any;
  payload: any;
  percent: any;
  value: any;
}) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.gender}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={12} // Add this line
      >{`Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={10} // Add this line
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const BeneficiariesByGender = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/kpi/beneficiaries/gender`,
          {
            withCredentials: true,
          }
        );
        const total = response.data.reduce(
          (total: number, item: { count: number }) => total + item.count,
          0
        );

        console.log(`Total beneficiaries: ${total}`);
        setData(response.data);
        setTotalBeneficiaries(total); // Add this line
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="p-2 m-auto">
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Beneficiaries by Gender"
          subtitle="Distribution of beneficiaries shown by gender"
          sideText={`${totalBeneficiaries} total beneficiaries`}
        />
      </div>
      <ResponsiveContainer width="99%" height={280}>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            onMouseEnter={onPieEnter}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BeneficiariesByGender;
