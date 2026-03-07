import { useState, useEffect } from 'react'
import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import BoxHeader from '../box-header/BoxHeader'
import { BeneficiaryGenderCount } from '@shared/model'

const COLORS = ['#40E0D0', '#008B8B', '#40E0D0', '#7FFFD4', '#20B2AA']

type ActiveSectorProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { gender: string }
  percent: number
  value: number
}

const renderActiveShape = (props: ActiveSectorProps) => {
  const RADIAN = Math.PI / 180
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
    value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={12}
      >{`Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={10}
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const BeneficiariesByGender = () => {
  const [data, setData] = useState<BeneficiaryGenderCount[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0)

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        // Assuming `window.context.fetchBeneficiariesByGender` is exposed via preload script
        const genderData: BeneficiaryGenderCount[] =
          await window.context.fetchBeneficiariesByGender()
        const total = genderData.reduce((total, item) => total + item.count, 0)

        setData(genderData)
        setTotalBeneficiaries(total)
      } catch (error) {
        console.error('There was an error fetching the beneficiaries by gender!', error)
      }
    }

    fetchGenderData()
  }, [])

  const onPieEnter = (_: React.MouseEvent<SVGElement, MouseEvent>, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="p-2 m-auto bg-white dark:bg-[#020817] dark:text-white">
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Beneficiaries by Gender"
          subtitle="Distribution of beneficiaries shown by gender"
          sideText={`${totalBeneficiaries} total beneficiaries`}
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape as unknown as (props: unknown) => JSX.Element}
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BeneficiariesByGender
