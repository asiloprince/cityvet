import { DispersalAndRedispersalData } from '@shared/model'
import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'

type Props = {
  title: string
  dataKey: string
  percentage: number
  chartData: object[]
}

function TotalDisperseLivestocksWidgets(props: Props) {
  const [total, setTotal] = useState({ dispersals: 0, redispersals: 0 })
  const [totalLastMonth, setTotalLastMonth] = useState(0)
  const [chartData, setChartData] = useState<{ name: string; dispersals: number }[]>([])

  useEffect(() => {
    const fetchTotalDispersalAndRedispersal = async () => {
      try {
        // Assuming `fetchTotalDispersalAndRedispersal` is exposed via preload script
        const totalDispersalAndRedispersal =
          await window.context.fetchTotalDispersalAndRedispersal()
        setTotal(totalDispersalAndRedispersal)
      } catch (error) {
        console.error(
          'There was an error fetching the total dispersal and redispersal data!',
          error
        )
      }
    }

    fetchTotalDispersalAndRedispersal()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the function exposed via preload script instead of Axios
        const apiData: DispersalAndRedispersalData[] =
          await window.context.fetchDispersalsAndRedispersal('Month')

        const transformedData: {
          [key: string]: { [key: string]: { dispersals: number } }
        } = {}

        // Process the fetched data to fit the expected structure
        apiData.forEach((item) => {
          const year = item.year ? item.year.toString() : 'unknown'
          const month = item.month ? item.month.toString().padStart(2, '0') : 'unknown' // Ensure month is in 'MM' format

          if (!transformedData[year]) {
            transformedData[year] = {}
          }

          if (!transformedData[year][month]) {
            transformedData[year][month] = { dispersals: 0 }
          }

          // Assuming 'status' indicates whether it's a dispersal
          if (item.status === 'Dispersed') {
            transformedData[year][month].dispersals += item.total
          }
        })

        // Convert the transformed data into chartData format
        const chartData: { name: string; dispersals: number }[] = []
        let lastMonthTotal = 0

        Object.values(transformedData).forEach((months) => {
          Object.entries(months).forEach(([month, values]) => {
            chartData.push({
              name: `Month ${month}`,
              dispersals: values.dispersals
            })

            if (month === (new Date().getMonth() + 1).toString().padStart(2, '0')) {
              // Adjust for zero-based month index
              lastMonthTotal += values.dispersals
            }
          })
        })

        // Update the state with the new chart data
        setChartData(chartData)
        setTotalLastMonth(lastMonthTotal)
      } catch (error) {
        console.error('Error fetching dispersals and redispersals data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-full dark:text-white dark:bg-[#020817] bg-white">
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
        <span className="text-xs">
          last month{' '}
          <span
            className={
              totalLastMonth === 0
                ? 'text-red-500 dark:text-red-500'
                : 'text-green-500 font-bold font-poppin dark:text-green-500'
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

export default TotalDisperseLivestocksWidgets
