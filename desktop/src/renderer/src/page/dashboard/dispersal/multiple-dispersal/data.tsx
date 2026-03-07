import { useEffect, useState } from 'react'

import { BatchLivestocksDispersalType } from '../../../schema'
import { columns } from './column'
import { BatchDispersalDataTable } from './data-table'

export default function BatchDispersalTable() {
  const [batchDispersalData, setBatchDispersalData] = useState<BatchLivestocksDispersalType[]>([])

  useEffect(() => {
    const fetchBatchDispersedLivestockData = async (): Promise<void> => {
      try {
        const data = await window.context.BatchDispersedLivestockList()
        setBatchDispersalData(data)
      } catch (error) {
        console.error('Error fetching batch dispersed livestock data:', error)
      }
    }
    fetchBatchDispersedLivestockData()
  }, [])

  return <BatchDispersalDataTable columns={columns} data={batchDispersalData} />
}
