import { Database } from 'sqlite3'

export function createEartagsTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS eartags (
          eartag_id INTEGER PRIMARY KEY AUTOINCREMENT,
          ear_tag TEXT NOT NULL UNIQUE
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create eartags table:', err.message)
          reject(err)
        } else {
          console.log('Eartags table created or already exists.')
          resolve()
        }
      }
    )
  })
}
