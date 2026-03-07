import { useEffect, useState } from 'react'
import { columns } from './column'
import { LivestockDataTable } from './data-table'

import { LivestocksType } from '../../schema'
import { LivestockInfo } from '@shared/model'

export default function LivestockTable() {
  const [livestocksData, setLivestocksData] = useState<LivestocksType[]>([])

  useEffect(() => {
    const fetchLivestockData = async (): Promise<void> => {
      try {
        let data = await window.context.fetchLivestockList()
        // Ensure age is always a string
        data = data.map((livestock: LivestockInfo) => ({
          ...livestock,
          age: String(livestock.age)
        }))
        setLivestocksData(data)
      } catch (error) {
        console.log('Error fetching livestock data:', error)
      }
    }
    fetchLivestockData()
  }, [])

  return <LivestockDataTable columns={columns} data={livestocksData} />
}
