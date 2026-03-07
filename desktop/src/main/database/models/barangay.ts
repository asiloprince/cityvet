import { Database } from 'sqlite3'

interface Row {
  count: number
}

export function createBarangaysTable(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS barangays (
          barangay_id INTEGER PRIMARY KEY,
          barangay_name TEXT
        );`,
      (err) => {
        if (err) {
          console.error('Failed to create barangays table:', err.message)
          reject(err)
        } else {
          console.log('Barangays table created or already exists.')

          db.get(`SELECT COUNT(*) as count FROM barangays`, (err, row: Row) => {
            if (err) {
              console.error(err.message)
              reject(err)
            } else if (row.count === 0) {
              console.log('Barangays table is empty. Inserting data...')

              const barangays = [
                [1, 'Barangay 1'],
                [2, 'Barangay 2'],
                [3, 'Barangay 3'],
                [4, 'Barangay 4'],
                [5, 'Barangay 5'],
                [6, 'Barangay 6'],
                [7, 'Barangay 7'],
                [8, 'Barangay 8'],
                [9, 'Barangay 9'],
                [10, 'Banaba South'],
                [11, 'Barangay 11'],
                [12, 'Barangay 12'],
                [13, 'Barangay 13'],
                [14, 'Barangay 14'],
                [15, 'Barangay 15'],
                [16, 'Barangay 16'],
                [17, 'Barangay 17'],
                [18, 'Barangay 18'],
                [19, 'Barangay 19'],
                [20, 'Barangay 20'],
                [21, 'Barangay 21'],
                [22, 'Barangay 22'],
                [23, 'Barangay 23'],
                [24, 'Barangay 24'],
                [25, 'Alangilan'],
                [26, 'Balagtas'],
                [27, 'Balete'],
                [28, 'Banaba Center'],
                [29, 'Banaba West'],
                [30, 'Banaba East'],
                [31, 'Gulod Labac'],
                [32, 'Bilogo'],
                [33, 'Bolbok'],
                [34, 'Bucal'],
                [35, 'Calicanto'],
                [36, 'Catandala'],
                [37, 'Concepcion'],
                [38, 'Conde Itaas'],
                [39, 'Conde Labac'],
                [40, 'Cumba'],
                [41, 'Cuta'],
                [42, 'Dalig'],
                [43, 'Dela Paz Proper'],
                [44, 'Dela Paz Pulot Aplaya'],
                [45, 'Dela Paz Pulot Itaas'],
                [46, 'Dumuclay'],
                [47, 'Dumantay'],
                [48, 'Gulod Itaas'],
                [49, 'Gulod Labac'],
                [50, 'Haligue Kanluran'],
                [51, 'Haligue Silangan'],
                [52, 'Ilijan'],
                [53, 'Kumintang Ibaba'],
                [54, 'Kumintang Ilaya'],
                [55, 'Libjo'],
                [56, 'Liponpon Isla Verde'],
                [57, 'Maapaz'],
                [58, 'Mahabang Dahilig'],
                [59, 'Mahabang Parang'],
                [60, 'Mahacot Silangan'],
                [61, 'Mahacot Silangan'],
                [62, 'Malalim'],
                [63, 'Malibayo'],
                [64, 'Malitam'],
                [65, 'Maruclap'],
                [66, 'Mabacong'],
                [67, 'Pagkilatan'],
                [68, 'Paharang Kanluran'],
                [69, 'Paharang Silangan'],
                [70, 'Pallocan Kanluran'],
                [71, 'Pallocan Silangan'],
                [72, 'Pinamucan Ibaba'],
                [73, 'Pinamucan Proper'],
                [74, 'Pinamucan Silangan'],
                [75, 'Sampaga'],
                [76, 'San Agapito Isla Verde'],
                [77, 'San Agustin Kanluran'],
                [78, 'San Agustin Silangan'],
                [79, 'San Andres Isla Verde'],
                [80, 'San Antonio Isla Verde'],
                [81, 'San Isidro'],
                [82, 'San Jose Sico'],
                [83, 'San Miguel'],
                [84, 'San Pedro'],
                [85, 'Santa Clara'],
                [86, 'Santa Rita Aplaya'],
                [87, 'Santa Rita Karsada'],
                [88, 'Santo Domingo'],
                [89, 'Sto. Niño'],
                [90, 'Simlong'],
                [91, 'Sirang Lupa'],
                [92, 'Sorosoro Ibaba'],
                [93, 'Sorosoro Ilaya'],
                [94, 'Sorosoro Karsada'],
                [95, 'Tabangao Aplaya'],
                [96, 'Tabangao Ambulong'],
                [97, 'Tabangao Dao'],
                [98, 'Talahib Pandayan'],
                [99, 'Talahib Payapa'],
                [100, 'Talumpok Kanluran'],
                [101, 'Talumpok Silangan'],
                [102, 'Tingga Itaas'],
                [103, 'Tingga Labac'],
                [104, 'Tulo'],
                [105, 'Wawa']
              ]

              barangays.forEach((barangay) => {
                db.run(
                  `INSERT INTO barangays (barangay_id, barangay_name) VALUES (?, ?)`,
                  barangay,
                  (err) => {
                    if (err) {
                      console.error(err.message)
                    } else {
                      console.log(
                        `Row inserted with barangay_id ${barangay[0]} and barangay_name ${barangay[1]}`
                      )
                    }
                  }
                )
              })
            } else {
              console.log('Barangays table already has data. Skipping insertion.')
            }

            resolve()
          })
        }
      }
    )
  })
}
