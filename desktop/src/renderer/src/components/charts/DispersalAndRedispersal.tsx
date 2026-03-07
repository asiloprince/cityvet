import React, { useEffect, useState } from 'react'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import BoxHeader from '../box-header/BoxHeader'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandSeparator,
  CommandEmpty
} from '../ui/command'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { DispersalAndRedispersalData } from '@shared/model'

interface DataItem {
  year: number
  month?: number
  quarter?: number
  dispersals: number
  redispersals: number
  timePeriodName: string
  [key: string]: number | string | undefined
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const DispersalAndRedispersalAreaCharts: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [timePeriod, setTimePeriod] = useState('Month')
  const [selectedDispersals, setSelectedDispersals] = useState<Set<string>>(
    new Set(['dispersals', 'redispersals'])
  )
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData: DispersalAndRedispersalData[] =
          await window.context.fetchDispersalsAndRedispersal(timePeriod)

        const transformedData: DataItem[] = []
        apiData.forEach((data) => {
          const year = parseInt(data.year)
          const month = data.month ? parseInt(data.month) : undefined
          const quarter = data.quarter ? Math.ceil(parseInt(data.quarter) / 3) : undefined

          // Find or create the DataItem for the year and period
          let item = transformedData.find(
            (d) => d.year === year && d.month === month && d.quarter === quarter
          )
          if (!item) {
            item = {
              year,
              month,
              quarter,
              dispersals: 0,
              redispersals: 0,
              timePeriodName: ''
            }
            transformedData.push(item)
          }

          // Update the dispersals or redispersals based on the status
          if (data.status === 'Dispersed') {
            item.dispersals += data.total
          } else if (data.status === 'Redispersed') {
            item.redispersals += data.total
          }

          // Set the timePeriodName based on the time period
          if (timePeriod === 'Month' && month !== undefined) {
            item.timePeriodName = monthNames[month - 1]
          } else if (timePeriod === 'Quarter' && quarter !== undefined) {
            item.timePeriodName = `Q${quarter}`
          } else if (timePeriod === 'Year') {
            item.timePeriodName = `Year ${year}`
          }
        })

        // Sorting logic remains the same

        setData(transformedData)
      } catch (error) {
        console.error('Error fetching dispersals and redispersals data: ', error)
      }
    }

    fetchData()
  }, [timePeriod, selectedYear])

  const handleTimePeriodChange = (newTimePeriod: string) => {
    setTimePeriod(newTimePeriod)
  }

  const filteredData = data.filter((item) => {
    return selectedDispersals.size > 0
      ? Array.from(selectedDispersals).some((dispersal) => item[dispersal])
      : true
  })

  return (
    <div className="bg-white dark:bg-[#020817] dark:text-white p-2 h-auto sm:px-7.5 xl:col-span-8 text-text-primary mt-4 rounded-md">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <BoxHeader
            title="Dispersals and Redispersals Over Time"
            subtitle="Dispersal trends shown by original dispersal dates, redispersal trends shown by offspring redispersal dates"
            sideText=""
          />
        </div>
        <div className="flex w-full max-w-45 justify-end ">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center] ml-2"
                >
                  <Icons.filter className="mr-2 h-4 w-4" />
                  Filter
                  {selectedDispersals.size > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                        {selectedDispersals.size}
                      </Badge>
                      <div className="hidden space-x-1 lg:flex">
                        {Array.from(selectedDispersals).map((dispersal) => (
                          <Badge
                            variant="default"
                            key={dispersal}
                            className="rounded-sm px-1 font-normal"
                          >
                            {dispersal}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Select Dispersal Type" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {['dispersals', 'redispersals'].map((dispersal) => (
                        <CommandItem
                          key={dispersal}
                          onSelect={() => {
                            if (selectedDispersals.has(dispersal)) {
                              selectedDispersals.delete(dispersal)
                            } else {
                              selectedDispersals.add(dispersal)
                            }
                            setSelectedDispersals(new Set(selectedDispersals))
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDispersals.has(dispersal)}
                            onChange={() => null}
                          />{' '}
                          <label>{dispersal}</label>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {selectedDispersals.size > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => setSelectedDispersals(new Set())}
                            className="justify-center text-center"
                          >
                            Clear filters
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="inline-flex items-center rounded-md bg-gray-200 p-1 mx-4 bg-white dark:bg-[#020817] dark:text-white">
            <button
              onClick={() => handleTimePeriodChange('Month')}
              className={`rounded py-1 px-3 text-xs font-medium ${
                timePeriod === 'Month' ? 'bg-white dark:bg-gray-800' : ''
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimePeriodChange('Quarter')}
              className={`rounded py-1 px-3 text-xs font-medium ${
                timePeriod === 'Quarter' ? 'bg-white dark:bg-gray-800' : ''
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => handleTimePeriodChange('Year')}
              className={`rounded py-1 px-3 text-xs font-medium  ${
                timePeriod === 'Year' ? 'bg-white dark:bg-gray-800' : ''
              }`}
            >
              Year
            </button>
          </div>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            <option value="">Select Year</option>
            {[...new Set(data.map((item) => item.year))].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={filteredData.filter((item) => !selectedYear || item.year === selectedYear)}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDispersals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRedispersals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00CED1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00CED1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timePeriodName" tickLine={false} style={{ fontSize: '12px' }} />
          <YAxis tickLine={false} style={{ fontSize: '12px' }} axisLine={{ strokeWidth: 0 }} />
          <Tooltip />
          {selectedDispersals.has('dispersals') && (
            <Area
              type="monotone"
              dot={true}
              dataKey="dispersals"
              stroke="#3C50E0"
              fillOpacity={1}
              fill="url(#colorDispersals)"
            />
          )}
          {selectedDispersals.has('redispersals') && (
            <Area
              type="monotone"
              dot={true}
              dataKey="redispersals"
              stroke="#3C50E0"
              fillOpacity={1}
              fill="url(#colorRedispersals)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DispersalAndRedispersalAreaCharts
