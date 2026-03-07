import { Database } from 'sqlite3'
import moment from 'moment'

interface BatchDispersalPayload {
  dispersal_id: number
  livestock_received: string
  age: string
  init_num_heads: number
}

interface DispersalData {
  dispersal_id: number
  beneficiary_id: number
  dispersal_date: string
  status: string
  contract_details: string | null
  num_of_heads: number
  notes: string | null
  livestock_received: string
  age: string
  init_num_heads: number
}

interface BatchDispersalList {
  batch_id: number
  livestock_received: string
  init_num_heads: number
  age: string
  dispersal_id: number
  num_of_heads: number
  dispersal_date: string
  status: string
  contract_details: string
  notes: string
  visit_date: string
  remarks: string
  visit_again: string
  beneficiary_id: number
  current_beneficiary: string
  barangay_name: string
}

interface Visit {
  visit_date: string
  remarks: string
  visit_again: boolean
}

interface BatchDispersal {
  batch_id: number
  livestock_received: number
  init_num_heads: number
  age: string
  dispersal_id: number
  beneficiary_id: number
  prev_ben_id: number
  recipient_id: number
  barangay_id: number
  visit_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  barangay_name: string
  visit_date: string
  remarks: string
  visit_again: boolean
  visits: Visit[]
}

function saveBatchDispersal(db: Database, payload: BatchDispersalPayload): Promise<number> {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO batch_dispersal (dispersal_id, livestock_received, age, init_num_heads) VALUES (?,?,?,?)'

    const values = [
      payload.dispersal_id,
      payload.livestock_received,
      payload.age,
      payload.init_num_heads
    ]

    db.run(sql, values, function (this: { lastID: number }, err: Error | null) {
      if (err) {
        console.error(err)
        reject(new Error('There was an error saving batch dispersal data'))
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export function handleBatchDispersal(db: Database, payload: DispersalData): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      const sql =
        'INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, num_of_heads, notes) VALUES (?, ?, ?, ?, ?, ?)'
      const values = [
        payload.beneficiary_id,
        payload.dispersal_date,
        payload.status || 'Dispersed',
        payload.contract_details || null,
        payload.init_num_heads,
        payload.notes || 'Write your notes here!'
      ]

      db.run(sql, values, function (this: { lastID: number }, err) {
        if (err) {
          console.error('Error inserting into dispersals:', err.message)
          db.run('ROLLBACK')
          reject(err)
        } else {
          const lastInsertedId = this.lastID
          const sql2 =
            'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)'
          const visitValues = [
            lastInsertedId,
            new Date().toISOString(),
            '(No Remarks)',
            'Not set',
            true
          ]

          db.run(sql2, visitValues, (err) => {
            if (err) {
              console.error('Error inserting into visits:', err.message)
              db.run('ROLLBACK')
              reject(err)
            } else {
              const batchDispersalPayload: BatchDispersalPayload = {
                dispersal_id: lastInsertedId,
                livestock_received: payload.livestock_received,
                age: payload.age,
                init_num_heads: payload.init_num_heads
              }
              saveBatchDispersal(db, batchDispersalPayload)
                .then(() => {
                  db.run('COMMIT')
                  resolve()
                })
                .catch((err) => {
                  console.error('Error in saveBatchDispersal:', err.message)
                  db.run('ROLLBACK')
                  reject(err)
                })
            }
          })
        }
      })
    })
  })
}

export function handleGetBatchDispersalList(db: Database): Promise<BatchDispersalList[]> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT bd.batch_id, bd.livestock_received, bd.init_num_heads,bd.age, d.dispersal_id, d.num_of_heads, d.dispersal_date, d.status, d.contract_details, d.notes,
        v.visit_date, v.remarks, v.visit_again, b.beneficiary_id, b.full_name AS current_beneficiary, br.barangay_name
        FROM batch_dispersal bd 
        JOIN dispersals d ON bd.dispersal_id = d.dispersal_id 
         LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id 
        LEFT JOIN (
          SELECT dispersal_id, visit_date, remarks, visit_again 
          FROM visits 
          WHERE (dispersal_id, visit_date) IN (
            SELECT dispersal_id, MAX(visit_date) 
            FROM visits 
            GROUP BY dispersal_id
          )
        ) v ON d.dispersal_id = v.dispersal_id 
        JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
        JOIN barangays br ON b.barangay_id = br.barangay_id;`

    db.all(sql, (err, rows: BatchDispersalList[]) => {
      if (err) {
        console.error('[DB Error]', err)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleGetBatchDispersalInfo(
  db: Database,
  batch_id: number
): Promise<BatchDispersal[]> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT bd.batch_id, bd.livestock_received, bd.init_num_heads, bd.age, d.*, b.full_name AS current_beneficiary, pb.full_name AS previous_beneficiary, rb.full_name AS recipient, br.barangay_name, v.visit_date, v.remarks, v.visit_again, 
    GROUP_CONCAT(DISTINCT recipient_b.full_name) AS recipient_beneficiaries
      FROM batch_dispersal bd 
      JOIN dispersals d ON bd.dispersal_id = d.dispersal_id 
      JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
      LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id 
      LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id 
      JOIN barangays br ON b.barangay_id = br.barangay_id 
      LEFT JOIN visits v ON d.dispersal_id = v.dispersal_id 
      LEFT JOIN dispersals r ON d.beneficiary_id = r.prev_ben_id 
      LEFT JOIN beneficiaries recipient_b ON r.beneficiary_id = recipient_b.beneficiary_id
      WHERE bd.batch_id = ? 
      GROUP BY bd.batch_id
      ORDER BY v.visit_date DESC`

    db.all(sql, [batch_id], (err, rows: BatchDispersal[]) => {
      if (err) {
        reject(err)
      } else {
        if (rows.length === 0) {
          reject({
            success: false,
            message: 'Batch dispersal not found'
          })
        }

        const batchDispersalData = rows[0]
        const visits = rows.map((row) => ({
          visit_date: row.visit_date,
          remarks: row.remarks,
          visit_again: row.visit_again
        }))

        batchDispersalData.visits = visits

        resolve(batchDispersalData ? [batchDispersalData] : [])
      }
    })
  })
}

export function handleDeleteBatchDispersal(db: Database, dispersal_id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('[DB Error]', err)
        reject(err)
        return
      }

      const sql1 = 'DELETE FROM batch_dispersal WHERE dispersal_id = ?'
      const sql2 = 'DELETE FROM visits WHERE dispersal_id = ?'
      const sql3 = 'DELETE FROM dispersals WHERE dispersal_id = ?'

      db.run(sql1, [dispersal_id], (err) => {
        if (err) {
          console.error('[DB Error]', err)
          db.run('ROLLBACK')
          reject(err)
          return
        }

        db.run(sql2, [dispersal_id], (err) => {
          if (err) {
            console.error('[DB Error]', err)
            db.run('ROLLBACK')
            reject(err)
            return
          }

          db.run(sql3, [dispersal_id], (err) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              reject(err)
              return
            }

            db.run('COMMIT', (err) => {
              if (err) {
                console.error('[DB Error]', err)
                db.run('ROLLBACK')
                reject(err)
              } else {
                resolve()
              }
            })
          })
        })
      })
    })
  })
}

interface UpdateBatchDispersal {
  num_of_heads: number
  notes: string
  contract_details: string
  visit_date: string
  remarks: string
  visit_again: boolean
}

export function handleUpdateBatchDispersalData(
  db: Database,
  batch_id: number,
  payload: UpdateBatchDispersal
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          console.error('[DB Error]', err)
          reject(err)
          return
        }

        const sql =
          'UPDATE dispersals SET num_of_heads = ?, notes = ?, contract_details = ? WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?)'
        const { num_of_heads, notes, visit_date, remarks, visit_again, contract_details } = payload

        const formattedDate = visit_date ? moment(visit_date).format('YYYY-MM-DD') : null

        const values = [num_of_heads, notes, contract_details, batch_id]

        db.run(sql, values, (err) => {
          if (err) {
            console.error('[DB Error]', err)
            db.run('ROLLBACK')
            reject(err)
            return
          }

          // Fetch the latest visit record
          const sql2 =
            'SELECT * FROM visits WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) ORDER BY visit_date DESC LIMIT 1'
          db.get(sql2, [batch_id], (err, row) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              reject(err)
              return
            }

            const latestVisit = row as Visit

            if (formattedDate) {
              // Check if a record with the same visit_date already exists
              const sql3 =
                'SELECT * FROM visits WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?'
              db.get(sql3, [batch_id, formattedDate], (err, row) => {
                if (err) {
                  console.error('[DB Error]', err)
                  db.run('ROLLBACK')
                  reject(err)
                  return
                }

                if (row) {
                  // if a record with the same date exists, update that record
                  const sql4 =
                    'UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?'

                  db.run(
                    sql4,
                    [
                      remarks || latestVisit.remarks,
                      visit_again || latestVisit.visit_again,
                      batch_id,
                      formattedDate
                    ],
                    (err) => {
                      if (err) {
                        console.error('[DB Error]', err)
                        db.run('ROLLBACK')
                        reject(err)
                        return
                      }
                    }
                  )
                } else {
                  // if no record with the same date exists, insert new visit records
                  const sql5 =
                    'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again) VALUES ((SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?),?,?,?)'

                  db.run(
                    sql5,
                    [
                      batch_id,
                      formattedDate,
                      remarks || latestVisit.remarks,
                      visit_again || latestVisit.visit_again
                    ],
                    (err) => {
                      if (err) {
                        console.error('[DB Error]', err)
                        db.run('ROLLBACK')
                        reject(err)
                        return
                      }
                    }
                  )
                }
              })
            } else {
              // if visit_date is not provided, update the latest visit record
              const sql6 =
                'UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?'

              db.run(
                sql6,
                [
                  remarks || latestVisit.remarks,
                  visit_again || latestVisit.visit_again,
                  batch_id,
                  latestVisit.visit_date
                ],
                (err) => {
                  if (err) {
                    console.error('[DB Error]', err)
                    db.run('ROLLBACK')
                    reject(err)
                    return
                  }
                }
              )
            }
          })
        })

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('[DB Error]', err)
            db.run('ROLLBACK')
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  })
}

interface RedisperseBatchDispersal {
  dispersal_id: number
  livestock_received: string
  age: string
  init_num_heads: number
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  redispersal_date: string
  prev_ben_id: number
  notes: string
}

function transferBatchLivestock(db: Database, payload: RedisperseBatchDispersal): Promise<number> {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO batch_dispersal (dispersal_id, livestock_received, age, init_num_heads) VALUES (?,?,?,?)'
    const values = [
      payload.dispersal_id,
      payload.livestock_received,
      payload.age,
      payload.init_num_heads
    ]

    db.run(sql, values, function (err) {
      if (err) {
        console.error(err)
        reject(new Error('There was an error transferring the livestock'))
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export async function handleBatchRedispersals(
  db: Database,
  payload: RedisperseBatchDispersal
): Promise<void> {
  const {
    beneficiary_id,
    dispersal_date,
    contract_details,
    redispersal_date,
    prev_ben_id,
    notes,
    init_num_heads
  } = payload

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      // Fetch current num_of_heads for prev_ben_id
      if (prev_ben_id) {
        db.get(
          'SELECT num_of_heads FROM dispersals WHERE beneficiary_id = ?',
          [prev_ben_id],
          (err, row) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              return reject(err)
            } else {
              const currentNumOfHeads = (row as { num_of_heads: number }).num_of_heads
              const newNumOfHeads = currentNumOfHeads - init_num_heads

              // Update num_of_heads for prev_ben_id
              db.run(
                'UPDATE dispersals SET num_of_heads = ? WHERE beneficiary_id = ?',
                [newNumOfHeads, prev_ben_id],
                (err) => {
                  if (err) {
                    console.error('[DB Error]', err)
                    db.run('ROLLBACK')
                    return reject(err)
                  }
                }
              )
            }
          }
        )
      }

      // If previous beneficiary is specified, update their dispersal
      if (prev_ben_id) {
        db.run(
          'UPDATE dispersals SET recipient_id = ?, status = "Redispersed", redispersal_date = CURRENT_TIMESTAMP WHERE beneficiary_id = ?',
          [beneficiary_id, prev_ben_id],
          (err) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              return reject(err)
            }
          }
        )
      }

      const sql =
        'INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, "Dispersed", ?, ?, ?, ?, ?)'
      const values = [
        beneficiary_id,
        dispersal_date,
        contract_details || null,
        redispersal_date || null,
        init_num_heads,
        prev_ben_id || null,
        notes || null
      ]

      db.run(sql, values, function (err) {
        if (err) {
          console.error('[DB Error]', err)
          db.run('ROLLBACK')
          return reject(err)
        } else {
          const lastInsertedId = this.lastID

          const sql2 =
            'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)'
          const visitValues = [
            lastInsertedId,
            new Date().toISOString(),
            '(No Remarks)',
            'Not set',
            true
          ]

          db.run(sql2, visitValues, (err) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              return reject(err)
            } else {
              payload.dispersal_id = lastInsertedId

              transferBatchLivestock(db, payload)
                .then(() => {
                  db.run('COMMIT', (err) => {
                    if (err) {
                      console.error('[DB Error]', err)
                      db.run('ROLLBACK')
                      return reject(err)
                    }
                    resolve()
                  })
                })
                .catch((err) => {
                  console.error('[DB Error]', err)
                  db.run('ROLLBACK')
                  reject(err)
                })
            }
          })
        }
      })
    })
  })
}

// interface BatchDispersalChainInfo {
//   batch_id: number
//   current_beneficiary: string
//   previous_beneficiary: string
//   recipient: string
//   recipient_dispersals: BatchDispersalChainInfo[]
// }

// interface DispersalRow {
//   batch_id: number
//   beneficiary_id: number
//   prev_ben_id: number | null
//   recipient_id: number | null
//   beneficiary_name: string
//   prev_ben_name: string | null
//   recipient_name: string | null
// }
// export function getBatchDispersalChain(
//   db: Database,
//   batch_id: number
// ): Promise<BatchDispersalChainInfo[]> {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT
//         bd.batch_id,
//         b.full_name AS beneficiary_name,
//         pb.full_name AS prev_ben_name,
//         rb.full_name AS recipient_name,
//         d.prev_ben_id,
//         d.recipient_id
//       FROM batch_dispersal bd
//       JOIN dispersals d ON bd.dispersal_id = d.dispersal_id
//       JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id
//       LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id
//       LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id
//       WHERE bd.batch_id = ?
//     `

//     db.all(query, [batch_id], (err, rows: DispersalRow[]) => {
//       if (err) {
//         console.error('Failed to get dispersal chain:', err.message)
//         reject(err)
//       } else {
//         const dispersalMap = new Map<number, BatchDispersalChainInfo>()
//         rows.forEach((row: DispersalRow) => {
//           dispersalMap.set(row.batch_id, {
//             batch_id: row.batch_id,
//             current_beneficiary: row.beneficiary_name,
//             previous_beneficiary: row.prev_ben_name || '',
//             recipient: row.recipient_name || '',
//             recipient_dispersals: []
//           })
//         })

//         const chainNodes = Array.from(dispersalMap.values())
//         resolve(chainNodes)
//       }
//     })
//   })
// }
