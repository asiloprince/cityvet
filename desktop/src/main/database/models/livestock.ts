import { Database } from 'sqlite3'

export function createLivestockTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS livestock (
          livestock_id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          category TEXT NOT NULL,
          age TEXT,
          health TEXT,
          isAlive TEXT,
          registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
          eartag_id INTEGER,
          is_dispersed BOOLEAN DEFAULT FALSE,
          UNIQUE(eartag_id),
          FOREIGN KEY(eartag_id) REFERENCES eartags(eartag_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create livestock table:', err.message)
          reject(err)
        } else {
          console.log('Livestock table created or already exists.')
          resolve()
        }
      }
    )
  })
}
