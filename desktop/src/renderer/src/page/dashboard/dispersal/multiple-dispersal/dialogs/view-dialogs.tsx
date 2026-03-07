import { useState, useEffect } from 'react'
import { DialogHeader, DialogTitle } from '../../../../../components/ui/dialog'
import { BatchLivestocksDispersalType } from '../../../../schema'
import moment from 'moment'

type viewProps = {
  batch: BatchLivestocksDispersalType
}

const keyNames: { [key: string]: string } = {
  batch_id: 'ID',
  livestock_received: 'Livestock Received',
  init_num_heads: 'Initial Number of Heads',
  age: 'Age',
  dispersal_id: 'Dispersal ID',
  num_of_heads: 'Number of Heads',
  dispersal_date: 'Dispersal Date',
  status: 'Status',
  contract_details: 'Contract Details',
  registration_date: 'Registration Date',
  previous_beneficiary: 'Previous Beneficiary',
  notes: 'Notes',
  redispersal_date: 'Redispersal Date',
  visit_date: 'Visit Date',
  remarks: 'Remarks',
  visit_again: 'Visit Again',
  beneficiary_id: 'Beneficiary ID',
  current_beneficiary: 'Beneficiary',
  barangay_name: 'Barangay',
  recipient_beneficiaries: 'List of recipients'
}
const BeneficiaryList = ({ beneficiaries }: { beneficiaries: string }) => {
  const beneficiaryArray = beneficiaries.split(',')
  return (
    <ol className="list-decimal list-inside">
      {beneficiaryArray.map((beneficiary, i) => (
        <li key={i}>{beneficiary}</li>
      ))}
    </ol>
  )
}

export default function ViewBatchDispersalDialog({ batch }: viewProps) {
  const [dispersalDetails, setDispersalDetails] = useState<BatchLivestocksDispersalType | null>(
    null
  )

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for batch_id:', batch.batch_id)
      try {
        const data = await window.context.fetchBatchDispersalInfo(batch.batch_id)
        if (data.length > 0) {
          setDispersalDetails(data[0])
        } else {
          console.error('No batch dispersal found with the provided ID')
        }
      } catch (err) {
        console.error('Error:', err)
      }
    }

    fetchData()
  }, [batch.batch_id])

  if (!dispersalDetails) {
    return <div>Loading...</div>
  }

  const entries = Object.entries(dispersalDetails).filter(
    ([key]) =>
      key !== 'notes' &&
      key !== 'dispersal_id' &&
      key !== 'beneficiary_id' &&
      key !== 'prev_ben_id' &&
      key !== 'recipient_id'
  )
  const notes = dispersalDetails.notes || ''
  return (
    <DialogHeader>
      <DialogTitle>View Dispersal Details</DialogTitle>
      <div className="py-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            <div className="bg-muted flex">
              <div className="w-1/2 px-4 py-4 font-bold border-t border-l border-gray-200">
                Name
              </div>
              <div className="w-1/2 px-4 py-4 font-bold border-t border-r border-gray-200">
                Details
              </div>
            </div>
            {entries.map(([key, value], index) => {
              const newKey = keyNames[key] || key
              let displayValue:
                | string
                | number
                | React.ReactNode
                | {
                    visit_date: string
                    remarks: string
                    visit_again: 'Yes' | 'No'
                  }[]
                | null = value

              if (
                ['redispersal_date', 'registration_date', 'dispersal_date', 'visit_date'].includes(
                  key
                ) &&
                typeof value === 'string'
              ) {
                displayValue = moment(value).format('MMMM DD, YYYY')
              }

              if (key === 'recipient_beneficiaries' && typeof value === 'string') {
                displayValue = <BeneficiaryList beneficiaries={value} />
              }

              return (
                <div key={index} className="flex hover:bg-gray-100">
                  <div className="w-1/2 px-4 py-4 border-b border-l border-gray-200">{newKey}</div>
                  <div className="w-1/2 px-4 py-4 border-b border-r border-gray-200">
                    {Array.isArray(displayValue)
                      ? displayValue.map((item, i) => (
                          <div key={i}>
                            <strong>Date Monitored:</strong>{' '}
                            {moment(item.visit_date).format('MMMM DD, YYYY')}
                            <br />
                            <strong>Remarks:</strong> {item.remarks}
                          </div>
                        ))
                      : displayValue}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-lg">Notes</h2>
            <textarea
              id="notes"
              name="notes"
              readOnly
              className="w-full h-20 p-2 border rounded-md mt-2"
              value={notes}
            />
          </div>
        </div>
      </div>
    </DialogHeader>
  )
}
