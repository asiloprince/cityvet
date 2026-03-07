import { SelectBeneficiary } from '@shared/model'
import { Database } from 'sqlite3'

interface Beneficiary {
  full_name: string
  birth_date: string
  gender: string
  mobile: string
  barangay_id: number
}
interface Row {
  count: number
}

export function addNewBeneficiary(db: Database, data: Beneficiary): void {
  const { full_name, birth_date, gender, mobile, barangay_id } = data
  db.run(
    `INSERT INTO beneficiaries (full_name, birth_date, gender, mobile, barangay_id) VALUES (?, ?, ?, ?, ?)`,
    [full_name, birth_date, gender, mobile, barangay_id],
    function (err) {
      if (err) {
        return console.error(err.message)
      }
      console.log(`New beneficiary added with rowid ${this.lastID}`)
    }
  )
}

export function fetchBeneficiaryInfo(db: Database, beneficiary_id: number): Promise<Beneficiary[]> {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT beneficiaries.beneficiary_id, full_name, birth_date, gender, mobile, barangays.barangay_name FROM beneficiaries INNER JOIN barangays ON beneficiaries.barangay_id = barangays.barangay_id WHERE beneficiaries.beneficiary_id = ?'
    db.get(sql, [beneficiary_id], (err, row: Beneficiary) => {
      if (err) {
        reject(err)
      } else {
        resolve(row ? [row] : []) // Ensure to return an array even if row is null
      }
    })
  })
}
export function fetchBeneficiariesList(db: Database): Promise<Beneficiary[]> {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT beneficiaries.beneficiary_id, full_name, birth_date, mobile, registration_date, gender, barangays.barangay_id, barangays.barangay_name FROM beneficiaries INNER JOIN barangays ON beneficiaries.barangay_id = barangays.barangay_id'
    db.all(sql, (err, rows: Beneficiary[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleUpdateBeneficiaries(
  db: Database,
  beneficiary_id: number,
  payload: Beneficiary
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT beneficiary_id FROM beneficiaries WHERE beneficiary_id = ?'
    db.get(sql, [beneficiary_id], (err, row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        reject(new Error('Beneficiary not found.'))
      } else {
        const sql2 =
          'UPDATE beneficiaries SET full_name = ?, birth_date = ?, mobile = ?, barangay_id = ? WHERE beneficiary_id = ?'
        const values = [
          payload.full_name,
          payload.birth_date,
          payload.mobile,
          payload.barangay_id,
          beneficiary_id
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

export function handleSelectBeneficiary(db: Database): Promise<SelectBeneficiary[]> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT beneficiaries.beneficiary_id, full_name FROM beneficiaries'
    db.all(sql, (err, rows: SelectBeneficiary[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function handleDeleteBeneficiaries(db: Database, beneficiary_id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS count FROM dispersals WHERE beneficiary_id = ?'
    db.get(sql, [beneficiary_id], (err, row: Row) => {
      if (err) {
        reject(err)
      } else if (row.count > 0) {
        reject(new Error('Beneficiary cannot be deleted because of associated dispersals.'))
      } else {
        const sql2 = 'DELETE FROM beneficiaries WHERE beneficiary_id = ?'
        db.run(sql2, [beneficiary_id], (err) => {
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
