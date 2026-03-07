import { Database } from 'sqlite3'

interface LivestockTypeCount {
  type: string
  total_heads: number
}

interface BeneficiaryGenderCount {
  gender: string
  count: number
}

export function handleTotalLivestockForEachType(db: Database): Promise<LivestockTypeCount[]> {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT
          type,
          COUNT(*) AS total_heads
        FROM livestock  
        GROUP BY type
  
        UNION ALL
  
        SELECT
          CASE
            WHEN livestock_received IN ('Broiler Chickens', 'Free Range Chickens') THEN 'Chickens'
            ELSE livestock_received
          END AS type,
          SUM(init_num_heads) AS total_heads
        FROM batch_dispersal
        GROUP BY type;
      `

    db.all(sql, (err, rows: LivestockTypeCount[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleBeneficiariesByGender(db: Database): Promise<BeneficiaryGenderCount[]> {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT gender, COUNT(*) as count
        FROM beneficiaries
        GROUP BY gender
      `

    db.all(sql, (err, rows: BeneficiaryGenderCount[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

// Define the types for the expected structure of the SQL query results and the final data
type DispersalStatusRow = {
  status: 'Dispersed' | 'Redispersed' | 'Both'
  total: number
}

type DispersalAndRedispersalCount = {
  dispersals: number
  redispersals: number
}

export function handleTotalDispersalAndRedispersal(
  db: Database
): Promise<DispersalAndRedispersalCount> {
  return new Promise((resolve, reject) => {
    const sql = `
          SELECT
            CASE
              WHEN dispersal_date IS NOT NULL AND redispersal_date IS NULL THEN 'Dispersed'
              WHEN dispersal_date IS NOT NULL AND redispersal_date IS NOT NULL THEN 'Both'
              WHEN redispersal_date IS NOT NULL THEN 'Redispersed'
            END AS status,
            COUNT(*) AS total
          FROM dispersals
          WHERE dispersal_date IS NOT NULL OR redispersal_date IS NOT NULL
          GROUP BY status
        `

    db.all(sql, (err, rows: DispersalStatusRow[]) => {
      if (err) {
        reject(err)
      } else {
        // Initialize the data object with zero counts
        const data: DispersalAndRedispersalCount = { dispersals: 0, redispersals: 0 }

        // Iterate over each row to accumulate the totals
        rows.forEach((row) => {
          if (row.status === 'Dispersed' || row.status === 'Both') {
            data.dispersals += row.total
          }
          if (row.status === 'Redispersed' || row.status === 'Both') {
            data.redispersals += row.total
          }
        })

        resolve(data)
      }
    })
  })
}

// Define the interfaces for the data structure
interface MonthData {
  [livestockType: string]: number
}

interface YearData {
  year: string
  months: { [month: string]: MonthData }
}

interface DispersalRow {
  year: string
  month: string
  livestock_received?: string
  category?: string
  init_num_heads: number
}

// The function to handle the dispersal of livestock data for a stacked bar chart
export function handleDisperseLivestocksStackBar(db: Database): Promise<YearData[]> {
  return new Promise((resolve, reject) => {
    const sqlBatchDispersal = `
        SELECT strftime('%Y', dispersal_date) as year, strftime('%m', dispersal_date) as month, livestock_received, init_num_heads
        FROM batch_dispersal
        JOIN dispersals ON batch_dispersal.dispersal_id = dispersals.dispersal_id
      `
    const sqlSingleDispersal = `
        SELECT strftime('%Y', dispersal_date) as year, strftime('%m', dispersal_date) as month, category, init_num_heads
        FROM single_dispersion
        JOIN dispersals ON single_dispersion.dispersal_id = dispersals.dispersal_id
        JOIN livestock ON single_dispersion.livestock_id = livestock.livestock_id
      `

    // Execute the batch dispersal query
    db.all(sqlBatchDispersal, (err, batchDispersalData: DispersalRow[]) => {
      if (err) {
        reject(err)
        return
      }

      // Execute the single dispersal query
      db.all(sqlSingleDispersal, (err, singleDispersalData: DispersalRow[]) => {
        if (err) {
          reject(err)
          return
        }

        // Combine the data from both queries
        const combinedData = [...batchDispersalData, ...singleDispersalData]

        // Process the combined data for charting
        const processedData: YearData[] = combinedData.reduce(
          (acc: YearData[], curr: DispersalRow) => {
            const { year, month, livestock_received, category, init_num_heads } = curr
            // Use a default value or a fallback for livestockType if it's undefined
            const livestockType = livestock_received || category || 'Unknown'

            // Filter year
            let yearData = acc.find((data) => data.year === year)
            if (!yearData) {
              yearData = { year, months: {} }
              acc.push(yearData)
            }

            // Filter month
            let monthData = yearData.months[month]
            if (!monthData) {
              monthData = {}
              yearData.months[month] = monthData
            }

            // Aggregate data by livestock type
            if (!monthData[livestockType]) {
              monthData[livestockType] = init_num_heads
            } else {
              monthData[livestockType] += init_num_heads
            }

            return acc
          },
          []
        )

        resolve(processedData)
      })
    })
  })
}

type DispersalPrediction = {
  year: string
  month: string
  total: number
}

export function handleDispersalsPrediction(db: Database): Promise<DispersalPrediction[]> {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        strftime('%Y', dispersal_date) AS year, 
        strftime('%m', dispersal_date) AS month,
        COUNT(*) AS total 
      FROM dispersals
      GROUP BY year, month
      ORDER BY year, month
    `

    db.all(sql, [], (err, rows: DispersalPrediction[]) => {
      if (err) {
        console.error('Error executing dispersals prediction query:', err)
        reject(new Error('Error executing dispersals prediction query'))
      } else {
        resolve(rows)
      }
    })
  })
}

interface DispersalAndRedispersalData {
  year: string
  month?: string
  quarter?: string
  status: string
  total: number
}

export function handleDispersalsAndRedispersal(
  db: Database,
  timePeriod: string
): Promise<DispersalAndRedispersalData[]> {
  return new Promise((resolve, reject) => {
    let sql
    if (timePeriod === 'Month') {
      sql = `
        SELECT 
          strftime('%Y', dispersal_date) AS year,
          strftime('%m', dispersal_date) AS month,
          'Dispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE dispersal_date IS NOT NULL
        GROUP BY year, month

        UNION ALL

        SELECT 
          strftime('%Y', redispersal_date) AS year,
          strftime('%m', redispersal_date) AS month,
          'Redispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE redispersal_date IS NOT NULL
        GROUP BY year, month
      `
    } else if (timePeriod === 'Quarter') {
      sql = `
        SELECT 
          strftime('%Y', dispersal_date) AS year,
          strftime('%m', dispersal_date) / 3 + 1 AS quarter,
          'Dispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE dispersal_date IS NOT NULL
        GROUP BY year, quarter

        UNION ALL

        SELECT 
          strftime('%Y', redispersal_date) AS year,
          strftime('%m', redispersal_date) / 3 + 1 AS quarter,
          'Redispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE redispersal_date IS NOT NULL
        GROUP BY year, quarter
      `
    } else if (timePeriod === 'Year') {
      sql = `
        SELECT 
          strftime('%Y', dispersal_date) AS year,
          'Dispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE dispersal_date IS NOT NULL
        GROUP BY year

        UNION ALL

        SELECT 
          strftime('%Y', redispersal_date) AS year,
          'Redispersed' AS status,
          COUNT(*) AS total
        FROM dispersals  
        WHERE redispersal_date IS NOT NULL
        GROUP BY year
      `
    }

    db.all(sql, [], (err, rows: DispersalAndRedispersalData[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}
