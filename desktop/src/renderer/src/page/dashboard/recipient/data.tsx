import { useEffect, useState } from 'react'

import { RecipientsType } from '../../schema'
import { columns } from './column'
import { RecipientsDataTable } from './data-table'

export default function RecipientTable(): JSX.Element {
  const [recipientsData, setRecipientsData] = useState<RecipientsType[]>([])

  useEffect(() => {
    const fetchBeneficiaryData = async (): Promise<void> => {
      try {
        const data = await window.context.fetchBeneficiaryList()
        setRecipientsData(data)
      } catch (error) {
        console.log('Error fetching expenses data:', error)
      }
    }
    fetchBeneficiaryData()
  }, [])

  return <RecipientsDataTable columns={columns} data={recipientsData} />
}
