import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
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

interface PieChartData {
  name: string
  value: number
}

const COLORS = ['#00FFFF', '#00E5EE', '#00CED1', '#00BFFF', '#87CEFA', '#87CEEB', '#7AC5CD']

interface YearData {
  year: string
  months: Record<string, Record<string, number>>
}

interface ChartData {
  [key: string]: number
}

interface FlattenedData {
  year: string
  month: string
  livestockType: string
  count: number
}

const DispersedLivestocksPieChart: React.FC = () => {
  const [data, setData] = useState<PieChartData[]>([])
  const [selectedLivestocks, setSelectedLivestocks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchDisperseLivestocksStackBar = async () => {
      try {
        const data = await window.context.handleDisperseLivestocksStackBar()

        const flattenedData = data.flatMap((yearData: YearData) => {
          return Object.entries(yearData.months).flatMap(([month, livestockData]) => {
            return Object.entries(livestockData).map(([livestockType, count]) => {
              return { year: yearData.year, month, livestockType, count }
            })
          })
        })

        const chartData = flattenedData.reduce((acc: ChartData, curr: FlattenedData) => {
          if (acc[curr.livestockType]) {
            acc[curr.livestockType] += curr.count
          } else {
            acc[curr.livestockType] = curr.count
          }
          return acc
        }, {})

        const pieChartData = Object.entries(chartData).map(([name, value]) => {
          return { name, value: value as number }
        })

        setData(pieChartData)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchDisperseLivestocksStackBar()
  }, [])

  const livestockTypes = [...new Set(data.map((item) => item.name))]

  const filteredData = data.filter((item) => {
    return selectedLivestocks.size > 0 ? selectedLivestocks.has(item.name) : true
  })

  const totalDisperseLivestocks = filteredData.reduce((total, item) => total + item.value, 0)

  return (
    <div className="mb-4 bg-white dark:bg-[#020817] dark:text-white">
      <div className=" flex-wrap sm:gap-2">
        <BoxHeader
          title="Dispersed Livestocks"
          subtitle="Distribution of dispersed livestocks shown by Category"
          sideText={`${totalDisperseLivestocks} total disperse`}
        />
      </div>
      <div className="flex justify-start mr-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center] "
            >
              <Icons.chevron className="mr-2 h-4 w-4" />
              Filter
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
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={filteredData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {filteredData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DispersedLivestocksPieChart
