import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'

import moment from 'moment'

type Props = {
  title: string
  dataKey: string
  percentage: number
  chartData: object[]
}

function TotalLivestoksWidgets(props: Props) {
  const [total, setTotal] = useState(0)
  const [chartData, setChartData] = useState<{ name: string; livestock: number }[]>([])
  const [totalLastMonth, setTotalLastMonth] = useState(0)

  useEffect(() => {
    const fetchDisperseLivestocksStackBar = async () => {
      try {
        // Assuming `handleDisperseLivestocksStackBar` is exposed via preload script
        const data = await window.context.handleDisperseLivestocksStackBar()

        const lastMonth = moment().subtract(1, 'months').format('MM')
        const currentYear = moment().format('YYYY')
        let totalLastMonth = 0
        let total = 0
        const chartData: { name: string; livestock: number }[] = []

        data.forEach(
          (item: { year: string; months: { [key: string]: { [key: string]: number } } }) => {
            if (item.year === currentYear) {
              if (item.months[lastMonth]) {
                Object.values(item.months[lastMonth]).forEach((value: number) => {
                  totalLastMonth += value
                })
              }

              Object.entries(item.months).forEach(([month, livestock]) => {
                chartData.push({
                  name: `Month ${month}`,
                  livestock: Object.values(livestock).reduce((a: number, b: number) => a + b, 0)
                })
              })
            }

            Object.values(item.months).forEach((month: { [key: string]: number }) => {
              Object.values(month).forEach((value: number) => {
                total += value
              })
            })
          }
        )

        setTotal(total)
        setTotalLastMonth(totalLastMonth)
        setChartData(chartData)
      } catch (error) {
        console.error(
          'There was an error fetching the livestock dispersal data for the stacked bar chart!',
          error
        )
      }
    }

    fetchDisperseLivestocksStackBar()
  }, [])

  return (
    <div className="flex h-full ">
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <span className=" text-wrap text-center text-sm font-poppin sm:text-left">
            {props.title}
          </span>
        </div>
        <h1 className="font-bold text-2xl font-poppin">
          {total}
          {/* <span className="font-bold text-sm">{props.percentage}</span> */}
        </h1>
        <span className="text-xs">
          last month{' '}
          <span
            className={
              totalLastMonth === 0 ? 'text-red-500' : 'text-green-500 font-bold font-poppin'
            }
          >
            +{totalLastMonth}
          </span>
        </span>
      </div>

      <div className="flex flex-col h-full justify-between w-20 ">
        <div className="w-full h-full">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: 'transparent', border: 'none' }}
                labelStyle={{ display: 'none' }}
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
          <span className="text-xs">Months</span>
        </div>
      </div>
    </div>
  )
}

export default TotalLivestoksWidgets
