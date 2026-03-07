import { Database } from 'sqlite3'

export function createRedispersalTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS redispersal (
        redispersal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dispersal_id INTEGER,
        beneficiary_id INTEGER,
        recipient_id INTEGER,
        FOREIGN KEY(dispersal_id) REFERENCES dispersals (dispersal_id),
        FOREIGN KEY(beneficiary_id) REFERENCES beneficiaries (beneficiary_id),
        FOREIGN KEY(recipient_id) REFERENCES beneficiaries (beneficiary_id)
      );`,
      (err) => {
        if (err) {
          console.error('Failed to create redispersal table:', err.message)
          reject(err)
        } else {
          console.log('Redispersal table created or already exists.')
          resolve()
        }
      }
    )
  })
}
