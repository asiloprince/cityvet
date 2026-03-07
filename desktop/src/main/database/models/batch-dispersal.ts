import { Database } from 'sqlite3'

export function createBatchDispersalTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS batch_dispersal (
          batch_id INTEGER PRIMARY KEY AUTOINCREMENT,
          dispersal_id INTEGER,
          livestock_received TEXT,
          init_num_heads INTEGER,
          age TEXT,
          FOREIGN KEY(dispersal_id) REFERENCES dispersals (dispersal_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create batch_dispersal table:', err.message)
          reject(err)
        } else {
          console.log('Batch_dispersal table created or already exists.')
          resolve()
        }
      }
    )
  })
}
