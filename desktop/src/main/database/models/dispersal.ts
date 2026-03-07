import { Database } from 'sqlite3'

export function createDispersalsTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS dispersals (
          dispersal_id INTEGER PRIMARY KEY AUTOINCREMENT,
          beneficiary_id INTEGER,
          dispersal_date TEXT,
          status TEXT CHECK( status IN ('Dispersed', 'Redispersed', 'Transferred') ),
          contract_details TEXT,
          redispersal_date TEXT,
          num_of_heads INTEGER,
          prev_ben_id INTEGER,
          recipient_id INTEGER,
          notes TEXT,
          registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries (beneficiary_id),
          FOREIGN KEY(prev_ben_id) REFERENCES beneficiaries (beneficiary_id),
          FOREIGN KEY(recipient_id) REFERENCES beneficiaries (beneficiary_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create dispersals table:', err.message)
          reject(err)
        } else {
          console.log('Dispersals table created or already exists.')
          resolve()
        }
      }
    )
  })
}
