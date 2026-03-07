import { useState } from 'react'
import DispersalAndRedispersalAreaCharts from '../../../components/charts/DispersalAndRedispersal'
import BeneficiariesByGender from '../../../components/charts/BeneficiariesByGender'
import DispersedLivestocksStackBar from '../../../components/charts/DispersedLivestocksStackBar'
import DispersedLivestocksPieChart from '../../../components/charts/DisperseLivestocksPieChart'
import { Link } from 'react-router-dom'

function Statistics() {
  const [chartType, setChartType] = useState('stackBar')

  const handlePieChartClick = () => {
    setChartType('pieChart')
  }

  const handleAreaChartClick = () => {
    setChartType('areaChart')
  }

  const handleAnalyticsClick = () => {
    setChartType('stackBar')
  }

  return (
    <>
      <div className="bg-white dark:bg-[#020817] dark:text-white text-black p-4 flex justify-between border-b border-gray-200">
        <div className="font-semibold" onClick={handleAnalyticsClick}>
          Analytics
        </div>
        <div onClick={handlePieChartClick}>Pie Chart</div>
        <div onClick={handleAreaChartClick}>Area Chart</div>
        <div>
          <span>
            <Link to={'/statistics'}>Dashboard</Link>
          </span>{' '}
          /{' '}
          <span>
            <Link to={'/predictions'} className="font-semibold">
              Predictions
            </Link>
          </span>{' '}
        </div>
      </div>
      <div
        className={`grid ${
          chartType === 'pieChart' ? 'md:grid-cols-2 grid-cols-1' : 'grid-cols-2'
        } gap-4 p-4`}
      >
        {chartType === 'stackBar' && (
          <div className="col-span-2 bg-white dark:bg-[#020817] dark:text-white rounded shadow p-4">
            <DispersedLivestocksStackBar />
          </div>
        )}
        {chartType === 'pieChart' && (
          <>
            <div className="col-span-1 bg-white dark:bg-[#020817] dark:text-white rounded shadow p-4">
              <DispersedLivestocksPieChart />
            </div>
            <div className="col-span-1 bg-white dark:bg-[#020817] dark:text-white rounded shadow p-4">
              <BeneficiariesByGender />
            </div>
          </>
        )}
        {chartType === 'areaChart' && (
          <div className="col-span-2 bg-white dark:bg-[#020817] dark:text-white rounded shadow p-4">
            <DispersalAndRedispersalAreaCharts />
          </div>
        )}
      </div>
    </>
  )
}

export default Statistics
