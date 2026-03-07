type BarangayName =
  | 'Barangay 1'
  | 'Barangay 2'
  | 'Barangay 3'
  | 'Barangay 4'
  | 'Barangay 5'
  | 'Barangay 6'
  | 'Barangay 7'
  | 'Barangay 8'
  | 'Barangay 9'
  | 'Banaba South'
  | 'Barangay 11'
  | 'Barangay 12'
  | 'Barangay 13'
  | 'Barangay 14'
  | 'Barangay 15'
  | 'Barangay 16'
  | 'Barangay 17'
  | 'Barangay 18'
  | 'Barangay 19'
  | 'Barangay 20'
  | 'Barangay 21'
  | 'Barangay 22'
  | 'Barangay 23'
  | 'Barangay 24'
  | 'Alangilan'
  | 'Balagtas'
  | 'Balete'
  | 'Banaba Center'
  | 'Banaba West'
  | 'Banaba East'
  | 'Bilogo'
  | 'Bolbok'
  | 'Bucal'
  | 'Calicanto'
  | 'Catandala'
  | 'Concepcion'
  | 'Conde Itaas'
  | 'Conde Labac'
  | 'Cumba'
  | 'Cuta'
  | 'Dalig'
  | 'Dela Paz Proper'
  | 'Dela Paz Pulot Aplaya'
  | 'Dela Paz Pulot Itaas'
  | 'Dumuclay'
  | 'Dumantay'
  | 'Gulod Itaas'
  | 'Gulod Labac'
  | 'Haligue Kanluran'
  | 'Haligue Silangan'
  | 'Ilijan'
  | 'Kumintang Ibaba'
  | 'Kumintang Ilaya'
  | 'Libjo'
  | 'Liponpon Isla Verde'
  | 'Maapaz'
  | 'Mahabang Dahilig'
  | 'Mahabang Parang'
  | 'Mahacot Silangan'
  | 'Malalim'
  | 'Malibayo'
  | 'Malitam'
  | 'Maruclap'
  | 'Mabacong'
  | 'Pagkilatan'
  | 'Paharang Kanluran'
  | 'Paharang Silangan'
  | 'Pallocan Kanluran'
  | 'Pallocan Silangan'
  | 'Pinamucan Ibaba'
  | 'Pinamucan Proper'
  | 'Pinamucan Silangan'
  | 'Sampaga'
  | 'San Agapito Isla Verde'
  | 'San Agustin Kanluran'
  | 'San Agustin Silangan'
  | 'San Andres Isla Verde'
  | 'San Antonio Isla Verde'
  | 'San Isidro'
  | 'San Jose Sico'
  | 'San Miguel'
  | 'San Pedro'
  | 'Santa Clara'
  | 'Santa Rita Aplaya'
  | 'Santa Rita Karsada'
  | 'Santo Domingo'
  | 'Sto. Niño'
  | 'Simlong'
  | 'Sirang Lupa'
  | 'Sorosoro Ibaba'
  | 'Sorosoro Ilaya'
  | 'Sorosoro Karsada'
  | 'Tabangao Aplaya'
  | 'Tabangao Ambulong'
  | 'Tabangao Dao'
  | 'Talahib Pandayan'
  | 'Talahib Payapa'
  | 'Talumpok Kanluran'
  | 'Talumpok Silangan'
  | 'Tingga Itaas'
  | 'Tingga Labac'
  | 'Tulo'
  | 'Wawa'

type LivestockCategory = 'Cattle' | 'CPDO Cattle' | 'Goat - Doe' | 'Goat - Buck' | 'Goat'

export interface Beneficiary {
  full_name: string
  birth_date: string
  gender: string
  mobile: string
  barangay_id: number
}
export interface BeneficiaryInfo {
  beneficiary_id: number
  full_name: string
  birth_date: string
  gender: string
  mobile: string
  barangay_name: string
  barangay_id: number
  registration_date: string
}

export interface EditBeneficiary {
  beneficiary_id: number
  full_name: string
  birth_date: string
  mobile: string
  barangay_name: string
  barangay_id: number
}

export interface Barangay {
  barangay_id: number
  barangay: string
}

export interface Livestock {
  type: string
  category: string
  age: string
  health: string
  isAlive: string
  ear_tag: string
}
export interface LivestockInfo {
  livestock_id: number
  type: string
  category: string
  age: string
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Not set' | undefined
  isAlive: 'Alive' | 'Deceased' | 'Unknown'
  ear_tag: string
}

export interface EditLivestock {
  livestock_id: number
  type: string
  category: string
  age: string
  health?: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Not set' | undefined
  isAlive: 'Alive' | 'Deceased' | 'Unknown'
  ear_tag?: string
}

export interface ToDisperseLivestocks {
  ear_tag: string
  type: string
  category: string
  livestock_id: string
  is_dispersed: boolean
}

export interface SelectBeneficiary {
  beneficiary_id: string
  full_name: string
}

export type DispersalLivestock = {
  dispersal_id: number
  livestock_id: number
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  init_num_heads: number
}
export interface DispersalList {
  dispersal_id: number
  dispersal_date: string
  num_of_heads: number
  status: 'Dispersed' | 'Redispersed' | 'Transferred'
  contract_details: string
  notes: string
  beneficiary_id: number
  current_beneficiary: string
  ear_tag: string
  category: LivestockCategory
  age: string
  init_num_heads: number
  barangay_name: BarangayName
  visit_date: string
  remarks: string
  visit_again: 'Not set' | 'Yes' | 'No' | undefined
  previous_beneficiary: string
  recipient: string
}
export interface BatchLivestockDispersal {
  dispersal_id: number
  beneficiary_id: number
  dispersal_date: string
  status: string
  contract_details: string | null
  num_of_heads: number
  notes: string | null
  livestock_received: string
  age: string
  init_num_heads: number
}
export interface BatchDispersalList {
  batch_id: number
  livestock_received: string
  init_num_heads: number
  age: string
  dispersal_id: number
  num_of_heads: number
  dispersal_date: string
  status: 'Dispersed' | 'Redispersed' | 'Transferred'
  contract_details: string
  notes: string
  visit_date: string
  remarks: string
  visit_again: 'Not set' | 'Yes' | 'No'
  beneficiary_id: number
  current_beneficiary: string
  barangay_name: BarangayName
  previous_beneficiary: string
  recipient: string
}

export interface BatchDispersal {
  batch_id: number
  livestock_received: string
  init_num_heads: number
  age: string
  dispersal_id: number
  beneficiary_id: number
  prev_ben_id: string
  recipient_id: number
  barangay_id: number
  visit_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  barangay_name: BarangayName
  visit_date: string
  remarks: string
  visit_again: 'Yes' | 'No' | 'Not set'

  num_of_heads: number
  dispersal_date: string
  status: 'Dispersed' | 'Redispersed' | 'Transferred'
}

export interface DispersalInfo {
  dispersal_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  ear_tag: string
  category: 'Cattle' | 'CPDO Cattle' | 'Goat - Doe' | 'Goat - Buck' | 'Goat'
  age: string
  dispersal_date: string
  num_of_heads: number
  status: 'Dispersed' | 'Redispersed' | 'Transferred'
  beneficiary_id: number
  init_num_heads: number
  barangay_name: BarangayName
  visit_date: string
  remarks: string
  visit_again: 'Yes' | 'No' | 'Not set'
  visits: Array<{
    visit_date: string
    remarks: string
    visit_again: 'Yes' | 'No'
  }>
  recipient_beneficiaries: string[]
}

export interface EditDispersal {
  contract_details: string
  num_of_heads: number
  notes: string
  visit_date?: string | null
  remarks: string
  visit_again: 'Yes' | 'No' | 'Not set'
  init_num_heads?: number
}

export interface UpdateBatchDispersal {
  num_of_heads: number
  notes?: string
  visit_date?: string | null
  remarks?: string
  visit_again: 'Yes' | 'No' | 'Not set'
  contract_details: string
}

export interface RedisperseBatchDispersal {
  dispersal_id: number
  livestock_received: string
  age: string
  init_num_heads: number
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  redispersal_date: string
  prev_ben_id: number
  notes: string
}
export interface RedisperseLivestock {
  dispersal_id?: number
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  redispersal_date: string
  prev_ben_id: number
  notes: string
  livestock_id: number
  init_num_heads: number
}
export interface RedispersalTransferLivestock {
  beneficiary_id: number
  dispersal_date: string
  contract_details: string
  notes: string
  num_of_heads: number
}
export interface RecentActivity {
  dispersal_id: number
  current_beneficiary: string
  registration_date: string
  num_of_heads: number
  status: string
  barangay_name: string
  livestock_received: string
}

export interface LivestockTypeCount {
  type: string
  total_heads: number
}
export interface BeneficiaryGenderCount {
  gender: string
  count: number
}
export type DispersalAndRedispersalCount = {
  dispersals: number
  redispersals: number
}

interface MonthData {
  [livestockType: string]: number
}
export interface YearData {
  year: string
  months: { [month: string]: MonthData }
}

export type DispersalPrediction = {
  year: string
  month: string
  total: number
}

export interface DispersalAndRedispersalData {
  year: string
  month?: string
  quarter?: string
  status: string
  total: number
}
export interface DispersalChainInfo {
  dispersal_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  recipient_dispersals: DispersalChainInfo[]
}
export interface BatchDispersalChainInfo {
  dispersal_id: number
  current_beneficiary: string
  previous_beneficiary: string
  recipient: string
  recipient_dispersals: DispersalChainInfo[]
}
