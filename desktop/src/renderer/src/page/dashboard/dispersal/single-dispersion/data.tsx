import { useEffect, useState } from 'react'

import { DispersalType } from '../../../schema'
import { columns } from './column'
import { DispersalDataTable } from './data-table'

export default function DispersalTable() {
  const [dispersalData, setDispersalData] = useState<DispersalType[]>([])

  useEffect(() => {
    const fetchDispersedLivestockData = async (): Promise<void> => {
      try {
        const data = await window.context.DispersedLivestockList()
        setDispersalData(data)
      } catch (error) {
        console.error('Error fetching dispersed livestock data:', error)
      }
    }
    fetchDispersedLivestockData()
  }, [])

  return <DispersalDataTable columns={columns} data={dispersalData} />
}
