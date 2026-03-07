import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import axios from 'axios'
import BoxHeader from '../box-header/BoxHeader'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '../ui/command'
import { Button } from '../ui/button'
import { Icons } from '../icons'

interface ChartData {
  year: string
  month: string
  [key: string]: number | string
}
interface Item {
  year: string
  months: Record<string, Record<string, number>>
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

const DispersedLivestocksStackBar: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([])
  const [year, setYear] = useState<string>('')
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set())
  const [selectedLivestocks, setSelectedLivestocks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchDisperseLivestocksStackBar = async () => {
      try {
        // Assuming `handleDisperseLivestocksStackBar` is exposed via preload script
        const data = await window.context.handleDisperseLivestocksStackBar()

        const flattenedData = data.flatMap((item: Item) => {
          return Object.entries(item.months).map(([month, livestockData]) => {
            return {
              year: item.year,
              month: monthNames[parseInt(month) - 1],
              ...(livestockData as Record<string, number>)
            }
          })
        })
        setData(flattenedData)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchDisperseLivestocksStackBar()
  }, [])

  const years = [...new Set(data.map((item) => item.year))]

  const filteredData = data.filter((item) => {
    return (
      (year ? item.year === year : true) &&
      (selectedMonths.size > 0 ? selectedMonths.has(item.month) : true) &&
      (selectedLivestocks.size > 0
        ? Array.from(selectedLivestocks).some((livestock) => item[livestock])
        : true)
    )
  })

  filteredData.sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month))

  const totalDisperseLivestocks = filteredData.reduce((total, item) => {
    Object.values(item).forEach((value) => {
      if (typeof value === 'number') {
        total += value
      }
    })
    return total
  }, 0)

  const livestockTypes = [
    ...new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== 'year' && key !== 'month'))
    )
  ]

  return (
    <div className="dark:bg-[#020817] dark:text-white">
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Dispersed Livestocks"
          subtitle="Distribution of dispersed livestocks shown by type"
          sideText={`${totalDisperseLivestocks} total dispersed`}
        />
      </div>
      <div className="flex justify-between mr-2">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center] ml-2"
              >
                <Icons.chevron className="mr-2 h-4 w-4" />
                Livestock
                {selectedLivestocks.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                      {selectedLivestocks.size}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {Array.from(selectedLivestocks).map((livestock) => (
                        <Badge
                          variant="default"
                          key={livestock}
                          className="rounded-sm px-1 font-normal"
                        >
                          {livestock}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Select Livestock" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {livestockTypes.map((livestock) => (
                      <CommandItem
                        key={livestock}
                        onSelect={() => {
                          if (selectedLivestocks.has(livestock)) {
                            selectedLivestocks.delete(livestock)
                          } else {
                            selectedLivestocks.add(livestock)
                          }
                          setSelectedLivestocks(new Set(selectedLivestocks))
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLivestocks.has(livestock)}
                          onChange={() => null}
                        />{' '}
                        <label>{livestock}</label>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {selectedLivestocks.size > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedLivestocks(new Set())}
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
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center] "
              >
                <Icons.calendar className="mr-2 h-4 w-4" />
                Month
                {selectedMonths.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                      {selectedMonths.size}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {Array.from(selectedMonths).map((month) => (
                        <Badge
                          variant="default"
                          key={month}
                          className="rounded-sm px-1 font-normal"
                        >
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Select Month" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {monthNames.map((month) => (
                      <CommandItem
                        key={month}
                        onSelect={() => {
                          if (selectedMonths.has(month)) {
                            selectedMonths.delete(month)
                          } else {
                            selectedMonths.add(month)
                          }
                          setSelectedMonths(new Set(selectedMonths))
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMonths.has(month)}
                          onChange={() => null}
                        />{' '}
                        <label>{month}</label>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {selectedMonths.size > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedMonths(new Set())}
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

          <select
            className="text-sm py-2 pl-4 pr-10 rounded-md outline-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center] ml-2"
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setSelectedMonths(new Set())
            }}
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          width={500}
          height={400}
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Free Range Chickens" stackId="a" fill="#00FFFF" />
          <Bar dataKey="Broiler Chickens" stackId="a" fill="#00E5EE" />
          <Bar dataKey="Cattle" stackId="a" fill="#00CED1" />
          <Bar dataKey="CPDO Cattle" stackId="a" fill="#00BFFF" />
          <Bar dataKey="Goat - Doe" stackId="a" fill="#87CEFA" />
          <Bar dataKey="Goat - Buck" stackId="a" fill="#87CEEB" />
          <Bar dataKey="Goat" stackId="a" fill="#7AC5CD" />
          <Bar dataKey="Swine" stackId="a" fill="#66CDAA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DispersedLivestocksStackBar
