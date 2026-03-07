import { Database } from 'sqlite3'


export function createVisitsTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS visits (
          visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
          dispersal_id INTEGER,
          visit_date TEXT,
          remarks TEXT,
          visit_again TEXT CHECK( visit_again IN ('Yes', 'No', 'Not set') ) DEFAULT 'Not set',
          is_default BOOLEAN DEFAULT FALSE,
          FOREIGN KEY(dispersal_id) REFERENCES dispersals (dispersal_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create visits table:', err.message)
          reject(err)
        } else {
          console.log('Visits table created or already exists.')
          resolve()
        }
      }
    )
  })
}
