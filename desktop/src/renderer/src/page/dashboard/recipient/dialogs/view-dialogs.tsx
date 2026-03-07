import { useState, useEffect } from 'react'

import { RecipientsType } from '../../../schema'
import { DialogHeader } from '../../../../components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import moment from 'moment'

type viewProps = {
  recipient: RecipientsType
}

const keyNames: { [key: string]: string } = {
  beneficiary_id: 'Beneficiary ID',
  full_name: 'Full Name',
  birth_date: 'Birth Date',
  mobile: 'Mobile',
  registration_date: 'Registration Date',
  gender: 'Gender',
  barangay_id: 'Barangay ID',
  barangay_name: 'Barangay'
}

export default function RecipientViewDialog({ recipient }: viewProps) {
  const [recipientDetails, setRecipientDetails] = useState<RecipientsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for beneficiary_id:', recipient.beneficiary_id)
      try {
        const data = await window.context.fetchBeneficiaryInfo(recipient.beneficiary_id)
        if (data.length > 0) {
          setRecipientDetails(data[0])
        } else {
          console.error('No beneficiary found with the provided ID')
        }
      } catch (err) {
        console.error('Error:', err)
      }
    }

    fetchData()
  }, [recipient.beneficiary_id])

  if (!recipientDetails) {
    return <div>Loading...</div>
  }

  const entries = Object.entries(recipientDetails).filter(([key]) => key !== 'barangay_id')

  return (
    <DialogHeader>
      <DialogTitle>View recipient Details</DialogTitle>
      <div className="py-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            <div className="bg-muted flex">
              <div className="w-1/2 px-4 py-4 font-bold border-t border-l border-gray-200">Key</div>
              <div className="w-1/2 px-4 py-4 font-bold border-t border-r border-gray-200">
                Value
              </div>
            </div>
            {entries.map(([key, value], index) => {
              const newKey = keyNames[key] || key

              let formattedValue = value

              if (key === 'birth_date' && value) {
                formattedValue = moment(value).format('MMMM DD, YYYY')
              }
              return (
                <div key={index} className="flex hover:bg-gray-100">
                  <div className="w-1/2 px-4 py-4 border-b border-l border-gray-200">{newKey}</div>
                  <div className="w-1/2 px-4 py-4 border-b border-r border-gray-200">
                    {Array.isArray(formattedValue)
                      ? formattedValue.map((item, i) => (
                          <div key={i}>
                            <strong>{newKey}:</strong> {item}
                            <br />
                          </div>
                        ))
                      : formattedValue}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DialogHeader>
  )
}
