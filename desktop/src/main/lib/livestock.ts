import { Database } from 'sqlite3'

interface Livestock {
  livestock_id: number
  type: string
  category: string
  age: string
  health: string
  isAlive: boolean
  ear_tag: string
}

type Row = {
  eartag_id: string
}

function addLivestockData(db: Database, livestockPayload: Livestock): Promise<number> {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO livestock (type, category, age, health, isAlive) VALUES (?,?,?,?,?)'
    const values = [
      livestockPayload.type,
      livestockPayload.category,
      livestockPayload.age,
      livestockPayload.health,
      livestockPayload.isAlive
    ]

    db.run(sql, values, function (this: { lastID: number }, err: Error | null) {
      if (err) {
        reject(err)
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export function handleLivestockRegistration(db: Database, payload: Livestock): Promise<void> {
  return new Promise((resolve, reject) => {
    const { ear_tag } = payload

    db.get('SELECT eartag_id FROM eartags WHERE ear_tag = ? LIMIT 1', [ear_tag], (err, row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        db.run(
          'INSERT INTO eartags (ear_tag) VALUES (?)',
          [ear_tag],
          function (this: { lastID: number }, err) {
            if (err) {
              reject(err)
            } else {
              const eartag_id = this.lastID
              // Assuming addLivestockData is defined elsewhere and returns a Promise
              addLivestockData(db, payload)
                .then((lastInsertedId) => {
                  db.run(
                    'UPDATE Livestock SET eartag_id = ? WHERE livestock_id = ?',
                    [eartag_id, lastInsertedId],
                    (err) => {
                      if (err) {
                        reject(err)
                      } else {
                        resolve()
                      }
                    }
                  )
                })
                .catch(reject)
            }
          }
        )
      } else {
        reject(new Error('Ear tag is already associated with a livestock.'))
      }
    })
  })
}

export function handleGetLivestockList(db: Database): Promise<Livestock[]> {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT livestock.livestock_id, type, category, age, health, isAlive, registration_date, eartags.ear_tag FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id'
    db.all(sql, (err, rows: Livestock[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleGetLivestockInfo(db: Database, livestock_id: number): Promise<Livestock[]> {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT livestock.livestock_id, eartags.ear_tag, type, category, age, health, isAlive FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id WHERE livestock.livestock_id = ?'
    db.get(sql, [livestock_id], (err, row: Livestock) => {
      if (err) {
        reject(err)
      } else {
        resolve(row ? [row] : [])
      }
    })
  })
}

export function handleToDisperseLivestockList(db: Database): Promise<Livestock[]> {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT eartags.ear_tag, livestock.type, livestock.category, livestock_id, livestock.is_dispersed FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id WHERE livestock.is_dispersed = false'
    db.all(sql, (err, rows: Livestock[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleUpdateLivestockRecord(
  db: Database,
  livestock_id: number,
  payload: Livestock
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT livestock_id FROM livestock WHERE livestock_id = ?'
    db.get(sql, [livestock_id], (err, row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        reject(new Error('Livestock not found.'))
      } else {
        const sql2 =
          'UPDATE livestock SET type = ?, category = ?, age = ?, health = ?, isAlive = ? WHERE livestock_id = ?'
        const values = [
          payload.type,
          payload.category,
          payload.age,
          payload.health,
          payload.isAlive,
          livestock_id
        ]
        db.run(sql2, values, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

export function handleDeleteLivestockRecord(db: Database, livestock_id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT livestock_id, eartag_id FROM livestock WHERE livestock_id = ?'
    db.get(sql, [livestock_id], (err, row: Row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        reject(new Error('Livestock not found.'))
      } else {
        const eartag_id = row.eartag_id
        const sql2 = 'DELETE FROM livestock WHERE livestock_id = ?'
        db.run(sql2, [livestock_id], (err) => {
          if (err) {
            reject(err)
          } else {
            // If there are no other livestock with the same eartag_id, delete the eartag
            const sql3 = 'SELECT livestock_id FROM livestock WHERE eartag_id = ?'
            db.get(sql3, [eartag_id], (err, row: Row) => {
              if (err) {
                reject(err)
              } else if (!row) {
                const sql4 = 'DELETE FROM eartags WHERE eartag_id = ?'
                db.run(sql4, [eartag_id], (err) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              } else {
                resolve()
              }
            })
          }
        })
      }
    })
  })
}
