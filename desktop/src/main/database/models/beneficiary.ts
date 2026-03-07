import { Database } from 'sqlite3'

export function createBeneficiariesTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS beneficiaries (
          beneficiary_id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          birth_date TEXT,
          mobile TEXT,
          barangay_id INTEGER,
          registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
          gender TEXT,
          FOREIGN KEY(barangay_id) REFERENCES barangays (barangay_id)
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create beneficiaries table:', err.message)
          reject(err)
        } else {
          console.log('Beneficiaries table created or already exists.')
          resolve()
        }
      }
    )
  })
}
