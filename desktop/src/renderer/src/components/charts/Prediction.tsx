import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend
} from 'recharts'
import regression from 'regression'
import BoxHeader from '../box-header/BoxHeader'

interface DispersalPrediction {
  year: string
  month: string
  total: number
}

interface FormattedData {
  month: string
  total: number
  trendline: number
  prediction?: number
}

function Prediction() {
  const [data, setData] = useState<FormattedData[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isDataInsufficient, setIsDataInsufficient] = useState(false)

  useEffect(() => {
    const fetchDispersalsPredictionData = async () => {
      try {
        const apiData: DispersalPrediction[] = await window.context.fetchDispersalsPrediction()
        console.log('Fetched API data: ', apiData)

        if (!apiData || apiData.length === 0) {
          setIsDataInsufficient(true)
          return
        }

        const currentYear = new Date().getFullYear()

        const currentYearData = apiData.filter(
          (item: DispersalPrediction) => parseInt(item.year) === currentYear
        )
        console.log('Current Year Data: ', currentYearData)

        if (currentYearData.length < 8) {
          setIsDataInsufficient(true)
          return
        }

        const regressionData = apiData.map((item: DispersalPrediction, index: number) => [
          index,
          item.total
        ])
        console.log('Data for Regression: ', regressionData)

        const regressionResult = regression.linear(regressionData)
        console.log('Regression Result: ', regressionResult)

        const formattedData = apiData
          .map((item: DispersalPrediction, index: number): FormattedData | undefined => {
            if (parseInt(item.year) === currentYear) {
              return {
                month: new Date(parseInt(item.year), parseInt(item.month) - 1).toLocaleString(
                  'default',
                  {
                    month: 'long'
                  }
                ),
                total: item.total,
                trendline: regressionResult.predict(index)[1],
                prediction: showPredictions ? regressionResult.predict(index + 12)[1] : undefined
              }
            }
            return undefined
          })
          .filter((item): item is FormattedData => item !== undefined)

        console.log('Formatted Data: ', formattedData)
        setData(formattedData)
      } catch (error) {
        console.error('Error fetching dispersals prediction data:', error)
        setIsDataInsufficient(true)
      }
    }

    fetchDispersalsPredictionData()
  }, [showPredictions])

  useEffect(() => {
    console.log('Data for chart: ', data)
  }, [data])
  return (
    <div>
      <div>
        <BoxHeader
          title="Dispersal Trend Analysis"
          subtitle="Visualizing the trend of dispersals over time"
          sideText="Historical Dispersal Data"
        />

        <div className="flex justify-end">
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded ml-4"
            onClick={() => setShowPredictions(!showPredictions)}
          >
            Show Predicted Dispersals For Next Year
          </button>
        </div>
      </div>
      {isDataInsufficient || data.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div>
            <h2>Insufficient Data</h2>
            <p>
              We&apos;re sorry, but there isn&apos;t enough historical data to make a prediction.
              Please check back when at least 8 months of data are available.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 5, right: 75, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={'#8884d8'} />
            <XAxis dataKey="month" tickLine={false} style={{ fontSize: '10px' }}>
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis axisLine={{ strokeWidth: '0' }} style={{ fontSize: '10px' }}>
              <Label value="Number of Dispersals" angle={-90} offset={-5} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" />
            <Line
              type="monotone"
              dataKey="total"
              stroke={'#8884d8'}
              strokeWidth={0}
              dot={{ strokeWidth: 5 }}
            />
            <Line type="monotone" dataKey="trendline" stroke="#8884d8" dot={false} />
            {showPredictions && (
              <Line strokeDasharray="5 5" dataKey="prediction" stroke="#8884d8" />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default Prediction
