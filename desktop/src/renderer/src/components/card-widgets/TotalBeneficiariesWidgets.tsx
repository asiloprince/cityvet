import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import moment from 'moment'

type Props = {
  title: string
  dataKey: string
  percentage: number
  chartData: object[]
  number: number
}

function TotalBeneficiariesWidgets(props: Props) {
  const [total, setTotal] = useState(0)
  const [chartData, setChartData] = useState<{ name: string; beneficiaries: number }[]>([])
  const [totalLastMonth, setTotalLastMonth] = useState(0)

  useEffect(() => {
    const lastMonthStart = moment().subtract(1, 'months').startOf('month')
    const lastMonthEnd = moment().subtract(1, 'months').endOf('month')

    const fetchBeneficiariesLastMonth = async () => {
      try {
        const beneficiaries = await window.context.fetchBeneficiaryList()
        const beneficiariesLastMonth = beneficiaries.filter((b) =>
          moment(b.registration_date).isBetween(lastMonthStart, lastMonthEnd)
        )
        setTotalLastMonth(beneficiariesLastMonth.length)
      } catch (error) {
        console.error('There was an error fetching the beneficiaries!', error)
      }
    }

    fetchBeneficiariesLastMonth()
  }, [])

  useEffect(() => {
    const lastMonth = moment().subtract(1, 'months')
    const weeksInMonth =
      moment(lastMonth).endOf('month').week() - moment(lastMonth).startOf('month').week() + 1

    const fetchBeneficiariesWeeklyData = async () => {
      try {
        const beneficiaries = await window.context.fetchBeneficiaryList()
        setTotal(beneficiaries.length)
        const weeklyData = Array.from({ length: weeksInMonth }, (_, i) => {
          const weekStart = moment(lastMonth).startOf('month').add(i, 'weeks')
          const weekEnd = moment(weekStart).endOf('week')
          const beneficiariesThisWeek = beneficiaries.filter((b) =>
            moment(b.registration_date).isBetween(weekStart, weekEnd)
          )

          return {
            name: `Week ${i + 1}`,
            beneficiaries: beneficiariesThisWeek.length
          }
        })

        setChartData(weeklyData)
      } catch (error) {
        console.error('There was an error fetching the beneficiaries!', error)
      }
    }

    fetchBeneficiariesWeeklyData()
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
          <span className={totalLastMonth === 0 ? 'text-red-500' : ' font-bold font-poppin'}>
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
          <span className="text-xs">Last Month (Weekly)</span>
        </div>
      </div>
    </div>
  )
}

export default TotalBeneficiariesWidgets
