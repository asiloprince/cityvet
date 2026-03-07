import { Database } from 'sqlite3'

export function createSingleDispersionTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS single_dispersion (
          dispersion_id INTEGER PRIMARY KEY AUTOINCREMENT,
          dispersal_id INTEGER,
          livestock_id INTEGER NOT NULL,
          init_num_heads INTEGER,
          FOREIGN KEY(dispersal_id) REFERENCES dispersals (dispersal_id),
          FOREIGN KEY(livestock_id) REFERENCES livestock (livestock_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create single_dispersion table:', err.message)
          reject(err)
        } else {
          console.log('Single_dispersion table created or already exists.')
          resolve()
        }
      }
    )
  })
}
