import { useState, useEffect } from 'react'

import axios from 'axios'
import { DialogHeader } from '../../../../components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { LivestocksType } from '../../../schema'

type viewProps = {
  livestock: LivestocksType
}

const keyNames: { [key: string]: string } = {
  livestock_id: 'Livestock ID',
  type: 'Animal Type',
  category: 'Livestock Received',
  age: 'Age',
  health: 'Health',
  isAlive: 'Is Alive',
  ear_tag: 'Code'
}

export default function LivestockViewDialog({ livestock }: viewProps) {
  const [livestockDetails, setLivestockDetails] = useState<LivestocksType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for livestock_id:', livestock.livestock_id)
      try {
        const data = await window.context.fetchLivestockInfo(livestock.livestock_id)
        if (data.length > 0) {
          setLivestockDetails(data[0])
        } else {
          console.error('No livestock found with the provided ID')
        }
      } catch (err) {
        console.error('Error:', err)
      }
    }

    fetchData()
  }, [livestock.livestock_id])

  if (!livestockDetails) {
    return <div>Loading...</div>
  }

  const entries = Object.entries(livestockDetails).filter(([key]) => key !== 'livestock_id')
  return (
    <DialogHeader>
      <DialogTitle>View livestock Details</DialogTitle>
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
              return (
                <div key={index} className="flex hover:bg-gray-100">
                  <div className="w-1/2 px-4 py-4 border-b border-l border-gray-200">{newKey}</div>
                  <div className="w-1/2 px-4 py-4 border-b border-r border-gray-200">
                    {Array.isArray(value)
                      ? value.map((item, i) => (
                          <div key={i}>
                            <strong>{newKey}:</strong> {item}
                            <br />
                          </div>
                        ))
                      : value}
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
