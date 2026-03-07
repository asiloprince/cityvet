import { Database } from 'sqlite3'
import moment from 'moment'

interface DispersalLivestock {
  dispersal_id: number
  livestock_id: number
  init_num_heads: number
  beneficiary_id: number
  dispersal_date: Date
  contract_details: string | null
  notes: string | null
}

interface DispersalList {
  dispersal_id: number
  dispersal_date: string
  num_of_heads: number
  status: string
  contract_details: string
  notes: string
  beneficiary_id: number
  current_beneficiary: string
  ear_tag: string
  category: string
  age: number
  init_num_heads: number
  barangay_name: string
  visit_date: string
  remarks: string
  visit_again: string
}

interface DispersalInfo {
  dispersal_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  ear_tag: string
  category: string
  age: number
  init_num_heads: number
  barangay_name: string
  visit_date: Date
  remarks: string
  visit_again: boolean
  visits: Array<{
    visit_date: Date
    remarks: string
    visit_again: boolean
  }>
  recipient_beneficiaries: string[]
}

interface RedisperseLivestock {
  dispersal_id?: number
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  redispersal_date: string
  prev_ben_id: number
  notes: string
  livestock_id: number
  init_num_heads: number
  num_of_heads: number
}

interface RecentActivity {
  dispersal_id: number
  current_beneficiary: string
  registration_date: string
  num_of_heads: number
  status: string
  barangay_name: string
  livestock_received: string
}
function saveDispersalLivestock(db: Database, payload: DispersalLivestock): Promise<number> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM single_dispersion WHERE livestock_id = ?'
    db.get(sql, [payload.livestock_id], (err, row) => {
      if (err) {
        console.error('Error querying single_dispersion:', err.message)
        reject(err)
      } else if (row) {
        console.error('Livestock already registered under different beneficiaries.')
        reject(
          new Error('The livestock has already been registered under different beneficiaries.')
        )
      } else {
        const sql2 =
          'INSERT INTO single_dispersion (dispersal_id, livestock_id, init_num_heads) VALUES (?, ?, ?)'
        const values = [payload.dispersal_id, payload.livestock_id, payload.init_num_heads]
        db.run(sql2, values, function (this: { lastID: number }, err: Error | null) {
          if (err) {
            console.error('Error inserting into single_dispersion:', err.message)
            reject(err)
          } else {
            resolve(this.lastID)
          }
        })
      }
    })
  })
}

export function handleLivestockDispersal(db: Database, payload: DispersalLivestock): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      const sql = `
          INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, num_of_heads, notes) 
          VALUES (?, ?, 'Dispersed', ?, ?, ?)
        `
      const values = [
        payload.beneficiary_id,
        payload.dispersal_date,
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
              payload.dispersal_id = lastInsertedId
              saveDispersalLivestock(db, payload)
                .then(() => {
                  const sql3 = 'UPDATE livestock SET is_dispersed = true WHERE livestock_id = ?'
                  db.run(sql3, [payload.livestock_id], (err) => {
                    if (err) {
                      console.error('Error updating livestock status:', err.message)
                      db.run('ROLLBACK')
                      reject(err)
                    } else {
                      db.run('COMMIT')
                      resolve()
                    }
                  })
                })
                .catch((err) => {
                  console.error('Error in saveDispersalLivestock:', err.message)
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

export function handleGetDispersalList(db: Database): Promise<DispersalList[]> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT d.dispersal_id, d.dispersal_date, d.num_of_heads, d.status, d.contract_details,d.notes, b.beneficiary_id,  b.full_name AS current_beneficiary,  e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name,  v.visit_date, v.remarks, v.visit_again 
      FROM dispersals d 
      JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
      LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id 
      LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id 
      JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id 
      JOIN livestock l ON sd.livestock_id = l.livestock_id 
      JOIN eartags e ON l.eartag_id = e.eartag_id 
      JOIN barangays br ON b.barangay_id = br.barangay_id 
      LEFT JOIN (
        SELECT dispersal_id, visit_date, remarks, visit_again 
        FROM visits 
        WHERE (dispersal_id, visit_date) IN (
          SELECT dispersal_id, MAX(visit_date) 
          FROM visits 
          GROUP BY dispersal_id
        )
      ) v ON d.dispersal_id = v.dispersal_id;`

    db.all(sql, (err, rows: DispersalList[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleGetDispersalsActivityRecords(db: Database): Promise<RecentActivity[]> {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT d.dispersal_id, b.full_name AS current_beneficiary, d.registration_date, d.num_of_heads, d.status, br.barangay_name,
          COALESCE(l.category, bd.livestock_received) AS livestock_received
      FROM dispersals d
      JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id
      JOIN barangays br ON b.barangay_id = br.barangay_id
      LEFT JOIN batch_dispersal bd ON d.dispersal_id = bd.dispersal_id
      LEFT JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id
      LEFT JOIN livestock l ON sd.livestock_id = l.livestock_id
      ORDER BY d.registration_date DESC;
    `

    db.all(sql, (err, rows: RecentActivity[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleGetDispersalInfo(
  db: Database,
  dispersal_id: number
): Promise<DispersalInfo[]> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT d.*, b.full_name AS current_beneficiary, pb.full_name AS previous_beneficiary, rb.full_name AS recipient, e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name, v.visit_date, v.remarks, v.visit_again, 
      GROUP_CONCAT(recipient_b.full_name) AS recipient_beneficiaries
      FROM dispersals d 
      JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
      LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id 
      LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id 
      JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id 
      JOIN livestock l ON sd.livestock_id = l.livestock_id 
      JOIN eartags e ON l.eartag_id = e.eartag_id 
      JOIN barangays br ON b.barangay_id = br.barangay_id 
      JOIN visits v ON d.dispersal_id = v.dispersal_id 
      LEFT JOIN dispersals r ON d.beneficiary_id = r.prev_ben_id 
      LEFT JOIN beneficiaries recipient_b ON r.beneficiary_id = recipient_b.beneficiary_id
      WHERE d.dispersal_id = ? 
      GROUP BY d.dispersal_id
      ORDER BY v.visit_date DESC`

    db.all(sql, [dispersal_id], (err, rows: DispersalInfo[]) => {
      if (err) {
        reject(err)
      } else {
        if (rows.length === 0) {
          resolve([])
        } else {
          const dispersalData = rows[0]
          const visits = rows.map((row) => ({
            visit_date: row.visit_date,
            remarks: row.remarks,
            visit_again: row.visit_again
          }))

          dispersalData.visits = visits

          resolve([dispersalData])
        }
      }
    })
  })
}
interface EditDispersal {
  contract_details: string
  num_of_heads: number
  notes: string
  visit_date: string
  remarks: string
  visit_again: string
  init_num_heads?: number
}

interface Visit {
  visit_date: string
  remarks: string
  visit_again: string
}

export function handleUpdateDispersalData(
  db: Database,
  dispersal_id: number,
  payload: EditDispersal
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
          'UPDATE dispersals SET contract_details = ?, num_of_heads = ?, notes = ? WHERE dispersal_id = ?'
        const { contract_details, num_of_heads, notes, visit_date, remarks, visit_again } = payload

        const formattedDate = visit_date ? moment(visit_date).format('YYYY-MM-DD') : null
        const values = [contract_details, num_of_heads, notes || null, dispersal_id]

        db.run(sql, values, (err) => {
          if (err) {
            console.error('[DB Error]', err)
            db.run('ROLLBACK')
            reject(err)
            return
          }

          if (payload.init_num_heads) {
            const sql2 = 'UPDATE single_dispersion SET init_num_heads = ? WHERE dispersal_id = ?'
            const single_dispersionValues = [payload.init_num_heads, dispersal_id]
            db.run(sql2, single_dispersionValues, (err) => {
              if (err) {
                console.error('[DB Error]', err)
                db.run('ROLLBACK')
                reject(err)
                return
              }
            })
          }

          // Fetch the latest visit record
          const sql3 =
            'SELECT * FROM visits WHERE dispersal_id = ? ORDER BY visit_date DESC LIMIT 1'
          db.get(sql3, [dispersal_id], (err, latestVisit: Visit | undefined) => {
            if (err) {
              console.error('[DB Error]', err)
              db.run('ROLLBACK')
              reject(err)
              return
            }

            if (formattedDate) {
              // Check if a record with the same visit_date already exists
              const sql4 = 'SELECT * FROM visits WHERE dispersal_id = ? AND visit_date = ?'
              db.get(sql4, [dispersal_id, formattedDate], (err, row) => {
                if (err) {
                  console.error('[DB Error]', err)
                  db.run('ROLLBACK')
                  reject(err)
                  return
                }

                if (row) {
                  // if a record with the same date exists, update that record
                  const sql5 =
                    'UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id = ? AND visit_date = ?'
                  db.run(
                    sql5,
                    [
                      remarks || latestVisit?.remarks,
                      visit_again || latestVisit?.visit_again,
                      dispersal_id,
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
                  const sql6 =
                    'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again) VALUES (?,?,?,?)'
                  db.run(
                    sql6,
                    [
                      dispersal_id,
                      formattedDate,
                      remarks || latestVisit?.remarks,
                      visit_again || latestVisit?.visit_again
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
            } else if (latestVisit) {
              // if visit_date is not provided, update the latest visit record
              const sql5 =
                'UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id = ? AND visit_date = ?'
              db.run(
                sql5,
                [
                  remarks || latestVisit.remarks,
                  visit_again || latestVisit.visit_again,
                  dispersal_id,
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

export function handleDeleteDispersalRecord(db: Database, dispersal_id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('[DB Error]', err)
        reject(err)
        return
      }

      const sql1 = 'DELETE FROM single_dispersion WHERE dispersal_id = ?'
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

export async function transferLivestock(
  db: Database,
  payload: RedisperseLivestock,
  lastInsertedId: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO single_dispersion (dispersal_id, livestock_id, init_num_heads) VALUES (?,?,?)'
    const values = [lastInsertedId, payload.livestock_id, payload.init_num_heads]

    db.run(sql, values, function (err) {
      if (err) {
        console.error(err)
        reject(new Error('There was an error transferring the livestock'))
      } else {
        resolve()
      }
    })
  })
}

export async function handleRedispersalOffspring(
  db: Database,
  payload: RedisperseLivestock
): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;', async (err) => {
          if (err) {
            console.error('[DB Error] Error starting transaction:', err)
            return reject(err)
          }

          try {
            // Check if livestock_id already exists
            const checkSql = 'SELECT * FROM single_dispersion WHERE livestock_id = ?'
            const row = await new Promise<{ livestock_id: number } | undefined>(
              (resolve, reject) => {
                db.get(checkSql, [payload.livestock_id], (err, row) => {
                  if (err) return reject(err)
                  resolve(row as { livestock_id: number } | undefined)
                })
              }
            )

            if (row) {
              throw new Error('Livestock ID already exists. Try Livestock Redisperse Transfer.')
            }

            // If previous beneficiary is specified, update recipient_id of their dispersal
            if (payload.prev_ben_id) {
              const updateSql =
                "UPDATE dispersals SET recipient_id = ?, status = 'Redispersed', redispersal_date = CURRENT_TIMESTAMP WHERE beneficiary_id = ?"
              const updateValues = [payload.beneficiary_id, payload.prev_ben_id]
              await new Promise<void>((resolve, reject) => {
                db.run(updateSql, updateValues, (err) => {
                  if (err) return reject(err)
                  resolve()
                })
              })
            }

            // Insert into dispersals
            const sql =
              "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, ?, ?, ?, ?)"
            const values = [
              payload.beneficiary_id,
              payload.dispersal_date,
              payload.contract_details || null,
              payload.redispersal_date || null,
              payload.init_num_heads,
              payload.prev_ben_id || null,
              payload.notes || null
            ]
            const lastInsertedId = await new Promise<number>((resolve, reject) => {
              db.run(sql, values, function (err) {
                if (err) return reject(err)
                resolve(this.lastID as number)
              })
            })

            // Insert dispersal default values for visit tables
            const sql2 =
              'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)'
            const visitValues = [
              lastInsertedId,
              new Date().toISOString(),
              '(No Remarks)',
              'Not set',
              true
            ]
            await new Promise<void>((resolve, reject) => {
              db.run(sql2, visitValues, (err) => {
                if (err) return reject(err)
                resolve()
              })
            })

            // Transfer livestock
            await transferLivestock(db, payload, lastInsertedId)

            // Update status
            const sql3 = 'UPDATE livestock SET is_dispersed = true WHERE livestock_id = ?'
            await new Promise<void>((resolve, reject) => {
              db.run(sql3, [payload.livestock_id], (err) => {
                if (err) return reject(err)
                resolve()
              })
            })

            // Commit transaction
            db.run('COMMIT;', (err) => {
              if (err) {
                console.error('[DB Error] Error committing transaction:', err)
                return reject(err)
              }
              resolve()
            })
          } catch (error) {
            // Rollback transaction in case of error
            db.run('ROLLBACK;', (err) => {
              if (err) {
                console.error('[DB Error] Error rolling back transaction:', err)
              }
              console.error('[Error] Error processing redispersal:', error)
              reject(error)
            })
          }
        })
      })
    })
  } catch (error) {
    console.error('[Error] Error handling redispersal:', error)
    throw new Error('There was an error processing the redispersal of the livestock.')
  }
}

interface Livestock {
  livestock_id: number
}

interface Dispersal {
  dispersal_id: number
  beneficiary_id: number
}

interface RedispersalStarterPayload {
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  notes: string
  num_of_heads: number
}

export async function handleRedispersalStarter(
  db: Database,
  dispersal_id: number,
  payload: RedispersalStarterPayload
): Promise<{ success: boolean; message: string }> {
  const { beneficiary_id, dispersal_date, contract_details, notes, num_of_heads } = payload

  try {
    await new Promise<void>((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;', async (err) => {
          if (err) {
            console.error('[DB Error] Error starting transaction:', err)
            return reject(err)
          }

          try {
            const dispersal: Dispersal = await new Promise((resolve, reject) => {
              db.get(
                'SELECT * FROM dispersals WHERE dispersal_id = ?',
                [dispersal_id],
                (err, row: Dispersal) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(row)
                  }
                }
              )
            })

            const livestock: Livestock = await new Promise((resolve, reject) => {
              db.get(
                'SELECT * FROM single_dispersion WHERE dispersal_id = ?',
                [dispersal_id],
                (err, row: Livestock) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(row)
                  }
                }
              )
            })

            const updateSql =
              "UPDATE dispersals SET recipient_id = ?, status = 'Transferred', num_of_heads = num_of_heads - 1, redispersal_date = CURRENT_TIMESTAMP WHERE dispersal_id = ?"
            const updateValues = [beneficiary_id, dispersal.dispersal_id]
            await new Promise<void>((resolve, reject) => {
              db.run(updateSql, updateValues, function (err) {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })

            const insertSql =
              "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, NULL, ?, ?, ?)"
            const insertValues = [
              beneficiary_id,
              dispersal_date,
              contract_details,
              num_of_heads,
              dispersal.beneficiary_id,
              notes
            ]
            const newdispersal_id = await new Promise<number>((resolve, reject) => {
              db.run(insertSql, insertValues, function (err) {
                if (err) {
                  reject(err)
                } else {
                  resolve(this.lastID as number)
                }
              })
            })

            const visitSql =
              'INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)'
            const visitValues = [
              newdispersal_id,
              new Date().toISOString(),
              '(No Remarks)',
              'Not set',
              true
            ]
            await new Promise<void>((resolve, reject) => {
              db.run(visitSql, visitValues, function (err) {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })

            const transferPayload: RedisperseLivestock = {
              beneficiary_id,
              dispersal_date,
              contract_details,
              redispersal_date: '',
              prev_ben_id: dispersal.beneficiary_id,
              notes,
              livestock_id: livestock.livestock_id,
              init_num_heads: num_of_heads,
              num_of_heads
            }

            await transferLivestock(db, transferPayload, newdispersal_id)

            db.run('COMMIT;', (err) => {
              if (err) {
                console.error('[DB Error] Error committing transaction:', err)
                return reject(err)
              }
              resolve()
            })
          } catch (error) {
            db.run('ROLLBACK;', (err) => {
              if (err) {
                console.error('[DB Error] Error rolling back transaction:', err)
              }
              console.error('[Error] Error processing redispersal:', error)
              reject(error)
            })
          }
        })
      })
    })

    return {
      success: true,
      message: 'Dispersal successfully created.'
    }
  } catch (err) {
    console.error('[DB Error]', err)
    return {
      success: false,
      message: 'There was an error saving dispersal information.'
    }
  }
}

interface DispersalChainInfo {
  dispersal_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  recipient_dispersals: DispersalChainInfo[]
}

interface DispersalRow {
  dispersal_id: number
  beneficiary_id: number
  prev_ben_id: number | null
  recipient_id: number | null
  beneficiary_name: string
  prev_ben_name: string | null
  recipient_name: string | null
}
export function getDispersalChain(
  db: Database,
  dispersalId: number
): Promise<DispersalChainInfo[]> {
  return new Promise((resolve, reject) => {
    const query = `
      WITH RECURSIVE dispersal_chain AS (
        SELECT
          d.dispersal_id,
          b.full_name AS beneficiary_name,
          pb.full_name AS prev_ben_name,
          rb.full_name AS recipient_name,
          d.prev_ben_id,
          d.recipient_id
        FROM dispersals d
        JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id
        LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id
        LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id
        WHERE d.dispersal_id = ?
        
        UNION ALL
        
        SELECT 
          d2.dispersal_id,
          b2.full_name AS beneficiary_name,
          pb2.full_name AS prev_ben_name,
          rb2.full_name AS recipient_name,
          d2.prev_ben_id,
          d2.recipient_id
        FROM dispersals d2
        JOIN beneficiaries b2 ON d2.beneficiary_id = b2.beneficiary_id
        LEFT JOIN beneficiaries pb2 ON d2.prev_ben_id = pb2.beneficiary_id
        LEFT JOIN beneficiaries rb2 ON d2.recipient_id = rb2.beneficiary_id
        INNER JOIN dispersal_chain dc ON dc.recipient_id = d2.beneficiary_id
      )
      SELECT * FROM dispersal_chain;
    `

    db.all(query, [dispersalId], (err, rows: DispersalRow[]) => {
      if (err) {
        console.error('Failed to get dispersal chain:', err.message)
        reject(err)
      } else {
        const dispersalMap = new Map<number, DispersalChainInfo>()
        rows.forEach((row: DispersalRow) => {
          dispersalMap.set(row.dispersal_id, {
            dispersal_id: row.dispersal_id,
            current_beneficiary: row.beneficiary_name,
            previous_beneficiary: row.prev_ben_name || '',
            recipient: row.recipient_name || '',
            recipient_dispersals: []
          })
        })

        rows.forEach((row: DispersalRow) => {
          if (row.prev_ben_id) {
            const parentDispersal = Array.from(dispersalMap.values()).find(
              (dispersal) => dispersal.current_beneficiary === row.prev_ben_name
            )
            if (parentDispersal) {
              parentDispersal.recipient_dispersals.push(dispersalMap.get(row.dispersal_id)!)
            }
          }
        })

        const chainNode = dispersalMap.get(dispersalId)
        resolve(chainNode ? [chainNode] : [])
      }
    })
  })
}
